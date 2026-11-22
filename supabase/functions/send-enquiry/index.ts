/**
 * Supabase Edge Function: send-enquiry
 *
 * Responsibilities:
 * - Validate input
 * - Persist to `public.enquiries` using service role
 * - Send an email to sales + an auto-reply to the customer via SMTP
 *
 * Required secrets (set via Supabase Dashboard or CLI):
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - SMTP_HOST (e.g. mail.skipaman.co.za)
 * - SMTP_PORT (e.g. 465)
 * - SMTP_USER (e.g. sales@skipaman.co.za)
 * - SMTP_PASS
 * - SMTP_SECURE ("true" for 465)
 *
 * Optional:
 * - SALES_TO (defaults to SMTP_USER)
 * - FROM_EMAIL (defaults to SMTP_USER)
 * - FROM_NAME (defaults to "SKIPAMAN")
 */

// Import type shims for the workspace TS checker (Edge Runtime provides the real APIs).
import "../deno.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.14";

type EnquiryType = "branding_quote" | "support" | "design_brief" | "general";

type EnquiryPayload = {
  type: EnquiryType;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  source?: string;
  lines?: unknown;
  organization?: string;
  notes?: string;
  [k: string]: unknown;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-auth",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-max-age": "86400",
} as const;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const getEnv = (key: string) => Deno.env.get(key)?.trim() || "";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  const timeout = new Promise<T>((_resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeout]);
}

function stringifySafe(v: unknown): string {
  try {
    return typeof v === "string" ? v : JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function buildSalesText(p: EnquiryPayload): string {
  const lines: string[] = [];
  lines.push("New website enquiry");
  lines.push("");
  lines.push(`Type: ${p.type}`);
  if (p.source) lines.push(`Source: ${p.source}`);
  if (p.subject) lines.push(`Subject: ${p.subject}`);
  lines.push("");
  lines.push("Customer");
  lines.push(`Name: ${p.name || "—"}`);
  lines.push(`Email: ${p.email || "—"}`);
  if (p.phone) lines.push(`Phone: ${p.phone}`);
  if (p.organization) lines.push(`Organisation: ${p.organization}`);
  lines.push("");
  if (p.message) {
    lines.push("Message");
    lines.push(p.message);
    lines.push("");
  }
  if (p.notes) {
    lines.push("Notes");
    lines.push(p.notes);
    lines.push("");
  }
  if (p.lines) {
    lines.push("Line items");
    lines.push(stringifySafe(p.lines));
    lines.push("");
  }
  return lines.join("\n");
}

function buildAutoReplyText(p: EnquiryPayload): string {
  const name = (p.name || "").trim();
  const greeting = name ? `Hi ${name},` : "Hi,";
  return [
    greeting,
    "",
    "Thanks for reaching out to SKIPAMAN. We’ve received your enquiry and we’ll reply as soon as possible.",
    "",
    "If you need to add more details, reply to this email and include your phone number and deadline.",
    "",
    "SKIPAMAN",
  ].join("\n");
}

async function sendMailSMTP(args: {
  to: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const host = getEnv("SMTP_HOST");
  const portRaw = getEnv("SMTP_PORT");
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");
  const secure = (getEnv("SMTP_SECURE") || "true").toLowerCase() === "true";

  if (!host || !portRaw || !user || !pass) {
    throw new Error("SMTP is not configured (missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS).");
  }
  const port = Number(portRaw);
  if (!Number.isFinite(port)) throw new Error("SMTP_PORT must be a number.");

  const transport = nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587 (STARTTLS usually)
    auth: { user, pass },
    // Keep timeouts low so the function never hangs.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

  await withTimeout(
    transport.sendMail({
      from: `${args.fromName} <${args.fromEmail}>`,
      to: args.to,
      subject: args.subject,
      text: args.text,
      replyTo: args.replyTo,
    }),
    12000,
    "SMTP sendMail",
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    // CORS preflight
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") return json(405, { ok: false, error: "Method not allowed" });

  let payload: EnquiryPayload;
  try {
    payload = (await req.json()) as EnquiryPayload;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }

  const type = payload.type;
  if (!type || !["branding_quote", "support", "design_brief", "general"].includes(type)) {
    return json(400, { ok: false, error: "Invalid enquiry type" });
  }

  const email = (payload.email || "").trim().toLowerCase();
  if (!email || !isEmail(email)) {
    return json(400, { ok: false, error: "A valid email is required" });
  }

  const name = (payload.name || "").trim();
  const message = (payload.message || payload.notes || "").toString().trim();
  if (!message && type !== "branding_quote") {
    // Branding quotes may be structured via lines.
    // For other types, ensure there’s at least something to respond to.
    return json(400, { ok: false, error: "Please add a message" });
  }

  const supabaseUrl = getEnv("SUPABASE_URL");
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json(500, { ok: false, error: "Server is not configured (Supabase secrets missing)" });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const insertRow = {
    type,
    name: name || null,
    email,
    phone: payload.phone ? String(payload.phone) : null,
    message: payload.message ? String(payload.message) : (payload.notes ? String(payload.notes) : null),
    payload,
  };

  const { error: insertErr } = await admin.from("enquiries").insert(insertRow);
  if (insertErr) {
    return json(500, { ok: false, error: "Failed to save enquiry", details: insertErr.message });
  }

  const salesTo = getEnv("SALES_TO") || getEnv("SMTP_USER");
  const fromEmail = getEnv("FROM_EMAIL") || getEnv("SMTP_USER");
  const fromName = getEnv("FROM_NAME") || "SKIPAMAN";

  // Send to sales inbox (reply-to customer)
  try {
    await sendMailSMTP({
      to: salesTo,
      fromEmail,
      fromName,
      subject: payload.subject || "Website enquiry",
      text: buildSalesText({ ...payload, email, name }),
      replyTo: email,
    });
  } catch (e) {
    // Still return ok (enquiry saved), but include a flag so frontend can show a hint.
    const msg = e instanceof Error ? e.message : String(e);
    return json(200, { ok: true, saved: true, emailed: false, message: msg });
  }

  // Auto-reply to customer (reply-to sales inbox)
  try {
    await sendMailSMTP({
      to: email,
      fromEmail,
      fromName,
      subject: "We received your enquiry",
      text: buildAutoReplyText({ ...payload, email, name }),
      replyTo: salesTo,
    });
  } catch {
    // Auto-reply failures are non-fatal
  }

  return json(200, { ok: true, saved: true, emailed: true });
});

