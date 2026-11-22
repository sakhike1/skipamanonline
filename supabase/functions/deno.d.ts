// Minimal shims so the frontend TS config doesn't error on Supabase Edge Functions.
// These types are intentionally loose; the Edge Runtime provides the real implementations.

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

declare module "npm:@supabase/supabase-js@2" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function createClient(...args: any[]): any;
}

declare module "npm:nodemailer@6.9.14" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodemailer: any;
  export default nodemailer;
}

declare module "https://deno.land/x/smtp@v0.7.0/mod.ts" {
  export class SmtpClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connect(config: any): Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connectTLS(config: any): Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send(config: any): Promise<void>;
    close(): Promise<void>;
  }
}

