import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Crosshair, Download, ImagePlus, Link2, Minus, Plus, Trash2, Type } from 'lucide-react';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import SelectMenu from '../components/ui/SelectMenu';
import { useToast } from '../components/ui/ToastProvider';

/* ------------------------------------------------------------------ data */

type GarmentId = 'tee' | 'hoodie' | 'cap' | 'jersey' | 'blazer' | 'beanie' | 'bucket';
type ViewId = 'front' | 'back' | 'model';
type Side = 'front' | 'back';
type ShapeId = 'star' | 'heart' | 'bolt' | 'ring' | 'smile';

type Layer = {
  id: string;
  type: 'text' | 'shape' | 'image';
  x: number;
  y: number;
  rotate: number;
  scale: number;
  color: string;
  text?: string;
  font?: string;
  shape?: ShapeId;
  src?: string;
  ar?: number; // image width / height
};

/** Area as fractions of the garment photo: x, y, width, height. */
type Frac = [number, number, number, number];

type Garment = {
  label: string;
  /** Plain black garment photo, recoloured in the browser. */
  photo: string;
  /** Real back photo, used when the file exists. */
  backPhoto?: string;
  /** Only shown once its photo file has been added to /public/design. */
  optional?: boolean;
  ar: number; // photo width / height until the real size loads
  front: Frac;
  back?: Frac;
  /** Pixel brightness range that counts as fabric, and the brightest fabric tone (for shading). */
  cut: { lo: number; hi: number; ref: number };
};

const BASE_CUT = { lo: 0.17, hi: 0.62, ref: 0.15 };

const GARMENTS: Record<GarmentId, Garment> = {
  tee: {
    label: 'T-shirt',
    photo: '/design/acdaaaf39b531ecceda57799d074b393.jpg',
    backPhoto: '/design/tee-back.jpg',
    ar: 0.751,
    front: [0.3, 0.232, 0.4, 0.341],
    back: [0.27, 0.17, 0.46, 0.5],
    cut: { lo: 0.17, hi: 0.62, ref: 0.13 },
  },
  hoodie: {
    label: 'Hoodie',
    photo: '/design/b095e74fc831edb257aea447a2a4882f.jpg',
    backPhoto: '/design/hoodie-back.jpg',
    ar: 0.769,
    front: [0.311, 0.4, 0.379, 0.209],
    back: [0.28, 0.3, 0.44, 0.42],
    cut: { lo: 0.17, hi: 0.62, ref: 0.16 },
  },
  cap: {
    label: 'Cap',
    photo: '/design/16bb00017ef4b58f685fba95c2648e34.jpg',
    ar: 0.667,
    front: [0.315, 0.364, 0.369, 0.164],
    cut: { lo: 0.26, hi: 0.4, ref: 0.21 },
  },
  jersey: {
    label: 'School jersey',
    photo: '/design/jersey.jpg',
    backPhoto: '/design/jersey-back.jpg',
    optional: true,
    ar: 0.8,
    front: [0.3, 0.2, 0.4, 0.35],
    back: [0.27, 0.15, 0.46, 0.5],
    cut: BASE_CUT,
  },
  blazer: {
    label: 'Blazer',
    photo: '/design/blazer.jpg',
    backPhoto: '/design/blazer-back.jpg',
    optional: true,
    ar: 0.8,
    front: [0.55, 0.3, 0.2, 0.15],
    back: [0.28, 0.2, 0.44, 0.45],
    cut: BASE_CUT,
  },
  beanie: {
    label: 'Beanie',
    photo: '/design/beanie.jpg',
    optional: true,
    ar: 0.9,
    front: [0.3, 0.45, 0.4, 0.28],
    cut: BASE_CUT,
  },
  bucket: {
    label: 'Bucket hat',
    photo: '/design/bucket-hat.jpg',
    optional: true,
    ar: 1,
    front: [0.3, 0.3, 0.4, 0.25],
    cut: BASE_CUT,
  },
};

/** "On a person" view (t-shirt only for now). Chest area is a fraction of the model photo. */
const MODEL = {
  photo: '/design/model-tee.jpg',
  /** Optional: same framing as the front photo, shot from behind. */
  backPhoto: '/design/model-tee-back.jpg',
  ar: 400 / 600,
  chest: [0.35, 0.208, 0.24, 0.15] as Frac,
  upperBack: [0.32, 0.19, 0.36, 0.2] as Frac,
  /** Region of the photo where the tee is, as x0,y0,x1,y1 fractions. */
  region: [0.2, 0.1667, 0.74, 0.485] as [number, number, number, number],
};

const GARMENT_COLORS = [
  { name: 'Black', value: '#17151b' },
  { name: 'White', value: '#f5f3f7' },
  { name: 'Charcoal', value: '#4b4a52' },
  { name: 'Navy', value: '#1f2c4d' },
  { name: 'Lilac', value: '#dcbcf7' },
  { name: 'Peach', value: '#ffcdb8' },
  { name: 'Pink', value: '#f7c4da' },
  { name: 'Sky', value: '#bcd3ff' },
  { name: 'Grey', value: '#b8b6bf' },
  { name: 'Yellow', value: '#ffd21f' },
  { name: 'Orange', value: '#ff8a3d' },
  { name: 'Red', value: '#d7263d' },
  { name: 'Maroon', value: '#6d1f2f' },
  { name: 'Green', value: '#22a06b' },
  { name: 'Forest', value: '#1f4a3a' },
  { name: 'Royal', value: '#2b4fe0' },
  { name: 'Purple', value: '#7c4dff' },
];

/** True when dark ink reads better than white on this colour. */
const isLightColor = (hex: string): boolean => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return false;
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 150;
};

const INK_COLORS = ['#ffffff', '#17151b', '#ff4d6d', '#ffd21f', '#3b6bff', '#7c4dff', '#22c58b', '#ff8a3d'];

const FONTS: Record<string, { label: string; css: string; weight: number; italic?: boolean }> = {
  bold: { label: 'Bold', css: "'Arial Black', Impact, sans-serif", weight: 900 },
  clean: { label: 'Clean', css: 'Inter, system-ui, sans-serif', weight: 600 },
  serif: { label: 'Serif', css: "Georgia, 'Times New Roman', serif", weight: 700, italic: true },
  mono: { label: 'Mono', css: "'Courier New', monospace", weight: 700 },
  script: { label: 'Script', css: "'Brush Script MT', 'Segoe Script', cursive", weight: 400, italic: true },
};

const SHAPES: Record<ShapeId, { label: string; d: string }> = {
  star: { label: 'Star', d: 'M0-30 8.8-9.6 31-8.8 13.6 5 19.6 26.6 0 14.4-19.6 26.6-13.6 5-31-8.8-8.8-9.6Z' },
  heart: { label: 'Heart', d: 'M0 26C-34 2-30-26-12-26-5-26 0-20 0-14 0-20 5-26 12-26 30-26 34 2 0 26Z' },
  bolt: { label: 'Bolt', d: 'M6-32-18 4H-3L-9 32 18-8H3Z' },
  ring: { label: 'Ring', d: 'M0-28A28 28 0 1 1 0 28 28 28 0 1 1 0-28ZM0-17A17 17 0 1 0 0 17 17 17 0 1 0 0-17Z' },
  smile: { label: 'Smile', d: 'M0-28A28 28 0 1 1 0 28 28 28 0 1 1 0-28ZM-10-8A4 4 0 1 0-10 0 4 4 0 1 0-10-8ZM10-8A4 4 0 1 0 10 0 4 4 0 1 0 10-8ZM-15 6Q0 24 15 6L12 4Q0 16-12 4Z' },
};

const STORAGE_DRAFT = 'skipaman_design_draft';
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Photo frame inside the 400x480 preview, from the photo's aspect ratio. */
const frameFor = (ar: number) => {
  const w = Math.min(380, 440 * ar);
  const h = w / ar;
  return { x: (400 - w) / 2, y: 20 + (440 - h) / 2, w, h };
};

const toArea = (frac: Frac, ar: number) => {
  const f = frameFor(ar);
  return { x: f.x + frac[0] * f.w, y: f.y + frac[1] * f.h, w: frac[2] * f.w, h: frac[3] * f.h };
};

/* -------------------------------------------------------- recolouring */

type Mask = { w: number; h: number; lum: Float32Array };
const maskCache = new Map<string, Promise<Mask>>();
const tintCache = new Map<string, { url: string; ar: number }>();

const loadMask = (photo: string): Promise<Mask> => {
  let hit = maskCache.get(photo);
  if (!hit) {
    hit = new Promise<Mask>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const w = 600;
        const h = Math.round((img.naturalHeight / img.naturalWidth) * w);
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        if (!ctx) return reject(new Error('no canvas'));
        ctx.drawImage(img, 0, 0, w, h);
        const px = ctx.getImageData(0, 0, w, h).data;
        const lum = new Float32Array(w * h);
        for (let i = 0; i < lum.length; i++) {
          lum[i] = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
        }
        resolve({ w, h, lum });
      };
      img.onerror = () => reject(new Error('image failed'));
      img.src = photo;
    });
    maskCache.set(photo, hit);
  }
  return hit;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Garment on a plain background: keep the photo's light and shadow, swap the colour, drop the background. */
const tintGarment = async (photo: string, cut: Garment['cut'], hex: string) => {
  const key = `${photo}|${hex}`;
  const cached = tintCache.get(key);
  if (cached) return cached;
  const { w, h, lum } = await loadMask(photo);
  const [tr, tg, tb] = hexToRgb(hex);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  const out = ctx.createImageData(w, h);
  for (let i = 0; i < lum.length; i++) {
    const L = lum[i];
    const alpha = clamp((cut.hi - L) / (cut.hi - cut.lo), 0, 1);
    const f = 0.55 + 0.55 * Math.min(1, L / cut.ref);
    out.data[i * 4] = Math.min(255, tr * f);
    out.data[i * 4 + 1] = Math.min(255, tg * f);
    out.data[i * 4 + 2] = Math.min(255, tb * f);
    out.data[i * 4 + 3] = alpha * 255;
  }
  ctx.putImageData(out, 0, 0);
  const res = { url: c.toDataURL('image/png'), ar: w / h };
  tintCache.set(key, res);
  return res;
};

/** Model photo: recolour only the tee region, leave the person and background alone. */
const tintModel = async (photo: string, hex: string) => {
  const key = `model|${photo}|${hex}`;
  const cached = tintCache.get(key);
  if (cached) return cached;
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('model failed'));
    i.src = photo;
  });
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('no canvas');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  const [tr, tg, tb] = hexToRgb(hex);
  const [rx0, ry0, rx1, ry1] = MODEL.region;
  const x0 = Math.floor(rx0 * w);
  const x1 = Math.floor(rx1 * w);
  const y0 = Math.floor(ry0 * h);
  const y1 = Math.floor(ry1 * h);
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 4;
      const L = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
      const a = clamp((0.4 - L) / 0.1, 0, 1);
      if (a <= 0) continue;
      const f = 0.55 + 0.55 * Math.min(1, L / 0.26);
      px[i] = px[i] * (1 - a) + Math.min(255, tr * f) * a;
      px[i + 1] = px[i + 1] * (1 - a) + Math.min(255, tg * f) * a;
      px[i + 2] = px[i + 2] * (1 - a) + Math.min(255, tb * f) * a;
    }
  }
  ctx.putImageData(data, 0, 0);
  const res = { url: c.toDataURL('image/jpeg', 0.92), ar: w / h };
  tintCache.set(key, res);
  return res;
};

const photoExists = (src: string) =>
  new Promise<boolean>((resolve) => {
    const i = new Image();
    i.onload = () => resolve(true);
    i.onerror = () => resolve(false);
    i.src = src;
  });

/* ------------------------------------------------------- share link codec */

type Shared = { g: GarmentId; c: string; l: Omit<Layer, 'id'>[]; b?: Omit<Layer, 'id'>[] };

const strip = (layers: Layer[]) =>
  layers
    .filter((x) => x.type !== 'image')
    .map((x) => {
      const copy: Partial<Layer> = { ...x };
      delete copy.id;
      return copy as Omit<Layer, 'id'>;
    });

const encode = (g: GarmentId, c: string, front: Layer[], back: Layer[]): string =>
  btoa(unescape(encodeURIComponent(JSON.stringify({ g, c, l: strip(front), b: strip(back) } satisfies Shared))));

const COLOR_RE = /^#[0-9a-f]{3,8}$/i;
const num = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? clamp(v, min, max) : fallback;

const cleanLayers = (raw: unknown): Layer[] => {
  const out: Layer[] = [];
  for (const l of (Array.isArray(raw) ? raw : []).slice(0, 30) as Partial<Layer>[]) {
    if (!l || (l.type !== 'text' && l.type !== 'shape')) continue;
    out.push({
      id: uid(),
      type: l.type,
      x: num(l.x, 0, 400, 200),
      y: num(l.y, 0, 480, 200),
      rotate: num(l.rotate, -180, 180, 0),
      scale: num(l.scale, 0.3, 4, 1),
      color: typeof l.color === 'string' && COLOR_RE.test(l.color) ? l.color : '#ffffff',
      text: l.type === 'text' ? String(l.text ?? '').slice(0, 40) : undefined,
      font: l.type === 'text' && typeof l.font === 'string' && l.font in FONTS ? l.font : 'bold',
      shape: l.type === 'shape' && typeof l.shape === 'string' && l.shape in SHAPES ? (l.shape as ShapeId) : 'star',
    });
  }
  return out;
};

const decode = (raw: string) => {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(raw)))) as Partial<Shared>;
    const garment: GarmentId = data.g && data.g in GARMENTS ? data.g : 'tee';
    const color = typeof data.c === 'string' && COLOR_RE.test(data.c) ? data.c : GARMENT_COLORS[0].value;
    return { garment, color, front: cleanLayers(data.l), back: cleanLayers(data.b) };
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------ page */

type DragState =
  | { kind: 'move'; id: string; dx: number; dy: number }
  | { kind: 'scale'; id: string; cx: number; cy: number; d0: number; s0: number }
  | { kind: 'rotate'; id: string; cx: number; cy: number };

const DesignStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const svgRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drag = useRef<DragState | null>(null);

  const initial = useMemo(() => {
    const raw = new URLSearchParams(window.location.search).get('d');
    return raw ? decode(raw) : null;
  }, []);

  const [garment, setGarment] = useState<GarmentId>(initial?.garment ?? 'tee');
  const [garmentColor, setGarmentColor] = useState(initial?.color ?? GARMENT_COLORS[0].value);
  const [view, setView] = useState<ViewId>('front');
  const [designs, setDesigns] = useState<Record<Side, Layer[]>>(() => {
    const starter: Layer = { id: uid(), type: 'text', x: 200, y: 200, rotate: 0, scale: 1, color: '#ffffff', text: 'SKIPAMAN', font: 'bold' };
    if (initial && (initial.front.length || initial.back.length)) return { front: initial.front, back: initial.back };
    return { front: [starter], back: [] };
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState('');
  const [tinted, setTinted] = useState<{ url: string; ar: number } | null>(null);
  const [photoError, setPhotoError] = useState(false);
  const [available, setAvailable] = useState<Set<string>>(new Set(['tee', 'hoodie', 'cap']));
  const [hasBackPhoto, setHasBackPhoto] = useState<Record<string, boolean>>({});
  const [modelSide, setModelSide] = useState<Side>('front');
  const [hasModelBack, setHasModelBack] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Optional garments and back photos appear as soon as their file exists in /public/design
  useEffect(() => {
    let alive = true;
    (async () => {
      const ids = Object.keys(GARMENTS) as GarmentId[];
      const ok = new Set<string>();
      const back: Record<string, boolean> = {};
      const modelBack = await photoExists(MODEL.backPhoto);
      await Promise.all(
        ids.map(async (id) => {
          const gm = GARMENTS[id];
          if (!gm.optional || (await photoExists(gm.photo))) ok.add(id);
          if (gm.backPhoto) back[id] = await photoExists(gm.backPhoto);
        }),
      );
      if (alive) {
        setAvailable(ok);
        setHasBackPhoto(back);
        setHasModelBack(modelBack);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const g = GARMENTS[garment];
  const canBack = Boolean(g.back);
  const canModel = garment === 'tee';
  const activeView: ViewId = view === 'back' && !canBack ? 'front' : view === 'model' && !canModel ? 'front' : view;
  const side: Side = activeView === 'back' || (activeView === 'model' && modelSide === 'back') ? 'back' : 'front';
  // On a person, back view without a back model photo falls back to the flat garment
  const flatModel = activeView === 'model' && modelSide === 'back' && !hasModelBack;
  const usingModel = activeView === 'model' && !flatModel;
  const editable = activeView !== 'model';
  const layers = designs[side];

  const useRealBack = side === 'back' && (activeView === 'back' || flatModel) && Boolean(hasBackPhoto[garment]);
  const photoUrl = useRealBack ? (g.backPhoto as string) : g.photo;

  useEffect(() => {
    let cancelled = false;
    setPhotoError(false);
    const job = usingModel
      ? tintModel(modelSide === 'back' ? MODEL.backPhoto : MODEL.photo, garmentColor)
      : tintGarment(photoUrl, g.cut, garmentColor);
    job.then(
      (res) => !cancelled && setTinted(res),
      () => !cancelled && setPhotoError(true),
    );
    return () => {
      cancelled = true;
    };
  }, [usingModel, modelSide, photoUrl, garmentColor, g.cut]);

  const photoAr = usingModel ? MODEL.ar : tinted?.ar ?? g.ar;
  const frame = frameFor(photoAr);
  const garmentAr = g.ar;
  const frontArea = toArea(g.front, garmentAr);
  const backArea = toArea(g.back ?? g.front, garmentAr);
  const area = side === 'back' ? backArea : frontArea;
  const modelArea = toArea(side === 'back' ? MODEL.upperBack : MODEL.chest, MODEL.ar);

  const selected = editable ? layers.find((l) => l.id === selectedId) ?? null : null;
  const isLight = isLightColor(garmentColor);
  const defaultInk = isLight ? '#17151b' : '#ffffff';

  const update = useCallback((id: string, patch: Partial<Layer>) => {
    setDesigns((d) => {
      const key: Side = d.front.some((l) => l.id === id) ? 'front' : 'back';
      return { ...d, [key]: d[key].map((l) => (l.id === id ? { ...l, ...patch } : l)) };
    });
  }, []);

  const removeLayer = useCallback((id: string) => {
    setDesigns((d) => ({ front: d.front.filter((l) => l.id !== id), back: d.back.filter((l) => l.id !== id) }));
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  // Delete / Backspace removes the selected item (unless you are typing in a field)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (!selectedId) return;
      e.preventDefault();
      removeLayer(selectedId);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, removeLayer]);

  const addLayer = (layer: Omit<Layer, 'id' | 'x' | 'y'>) => {
    const targetSide: Side = activeView === 'back' ? 'back' : 'front';
    if (view === 'model') setView('front');
    const list = designs[targetSide];
    if (list.length >= 30) {
      showToast('That is plenty on one side. Remove something first.', 'info');
      return;
    }
    const a = targetSide === 'back' ? backArea : frontArea;
    const id = uid();
    const jitter = (list.length % 5) * 10;
    setDesigns((d) => ({
      ...d,
      [targetSide]: [...d[targetSide], { ...layer, id, x: a.x + a.w / 2 + jitter, y: a.y + a.h / 2 + jitter }],
    }));
    setSelectedId(id);
  };

  // Switching garment re-fits both sides into the new print areas
  const switchGarment = (next: GarmentId) => {
    if (next === garment) return;
    const n = GARMENTS[next];
    const refit = (list: Layer[], from: ReturnType<typeof toArea>, to: ReturnType<typeof toArea>) => {
      const k = to.w / from.w;
      return list.map((l) => ({
        ...l,
        x: to.x + ((l.x - from.x) / from.w) * to.w,
        y: to.y + ((l.y - from.y) / from.h) * to.h,
        scale: clamp(l.scale * k, 0.3, 4),
      }));
    };
    setDesigns((d) => ({
      front: refit(d.front, frontArea, toArea(n.front, n.ar)),
      back: refit(d.back, backArea, toArea(n.back ?? n.front, n.ar)),
    }));
    setGarment(next);
    setSelectedId(null);
    if (!n.back && view === 'back') setView('front');
    if (next !== 'tee' && view === 'model') setView('front');
  };

  const addText = () => {
    const text = draftText.trim();
    if (!text) return;
    addLayer({ type: 'text', rotate: 0, scale: 1, color: defaultInk, text: text.slice(0, 40), font: 'bold' });
    setDraftText('');
  };

  const addShape = (shape: ShapeId) =>
    addLayer({ type: 'shape', rotate: 0, scale: 1, color: defaultInk === '#ffffff' ? '#ffd21f' : '#7c4dff', shape });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      showToast('Please use a PNG, JPG or WebP image.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('That image is over 2 MB. Try a smaller one.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onload = () =>
        addLayer({ type: 'image', rotate: 0, scale: 1, color: '#ffffff', src, ar: img.naturalWidth / img.naturalHeight || 1 });
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  /* ---- pointer handling: move, resize, rotate ---- */
  const toSvgPoint = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 };
  };

  const onLayerDown = (e: React.PointerEvent, layer: Layer) => {
    if (!editable) return;
    e.stopPropagation();
    setSelectedId(layer.id);
    const p = toSvgPoint(e);
    drag.current = { kind: 'move', id: layer.id, dx: layer.x - p.x, dy: layer.y - p.y };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const onScaleDown = (e: React.PointerEvent, layer: Layer) => {
    e.stopPropagation();
    const p = toSvgPoint(e);
    drag.current = {
      kind: 'scale',
      id: layer.id,
      cx: layer.x,
      cy: layer.y,
      d0: Math.max(8, Math.hypot(p.x - layer.x, p.y - layer.y)),
      s0: layer.scale,
    };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const onRotateDown = (e: React.PointerEvent, layer: Layer) => {
    e.stopPropagation();
    drag.current = { kind: 'rotate', id: layer.id, cx: layer.x, cy: layer.y };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = toSvgPoint(e);
    if (d.kind === 'move') {
      // Free placement across the whole garment, not only the dashed guide
      update(d.id, {
        x: clamp(p.x + d.dx, frame.x + frame.w * 0.12, frame.x + frame.w * 0.88),
        y: clamp(p.y + d.dy, frame.y + frame.h * 0.1, frame.y + frame.h * 0.92),
      });
    } else if (d.kind === 'scale') {
      update(d.id, { scale: clamp(d.s0 * (Math.hypot(p.x - d.cx, p.y - d.cy) / d.d0), 0.3, 4) });
    } else {
      let deg = (Math.atan2(p.y - d.cy, p.x - d.cx) * 180) / Math.PI + 90;
      if (deg > 180) deg -= 360;
      if (e.shiftKey) deg = Math.round(deg / 15) * 15;
      update(d.id, { rotate: clamp(deg, -180, 180) });
    }
  };

  const endDrag = () => {
    drag.current = null;
  };

  const box = (l: Layer) => {
    if (l.type === 'text') {
      const size = 30 * l.scale;
      return { w: Math.max(24, (l.text?.length ?? 1) * size * 0.62), h: size * 1.25 };
    }
    if (l.type === 'image') return { w: 110 * l.scale * Math.min(1, l.ar ?? 1), h: (110 * l.scale) / Math.max(1, l.ar ?? 1) };
    return { w: 64 * l.scale, h: 64 * l.scale };
  };

  const centreSelected = () => {
    if (!selected) return;
    update(selected.id, { x: area.x + area.w / 2, y: area.y + area.h / 2 });
  };

  const nudgeSize = (delta: number) => {
    if (!selected) return;
    update(selected.id, { scale: clamp(selected.scale + delta, 0.3, 4) });
  };

  /* ---- actions ---- */
  const shareUrl = () =>
    `${window.location.origin}/design-studio?d=${encodeURIComponent(encode(garment, garmentColor, designs.front, designs.back))}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      const hasImage = designs.front.concat(designs.back).some((l) => l.type === 'image');
      showToast(
        hasImage ? 'Link copied. Uploaded images are not included in links.' : 'Link copied. Send it to a friend.',
        'success',
      );
    } catch {
      showToast('Could not copy the link. Your browser blocked it.', 'error');
    }
  };

  const downloadPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    setSelectedId(null);
    requestAnimationFrame(() => {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.querySelectorAll('[data-ui]').forEach((n) => n.remove());
      const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1440;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#f3eff5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => {
          if (!b) return;
          const a = document.createElement('a');
          a.href = URL.createObjectURL(b);
          a.download = `skipaman-${garment}-${activeView}.png`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        }, 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        showToast('Could not make the picture. Try again.', 'error');
      };
      img.src = url;
    });
  };

  const describe = (list: Layer[]) =>
    list
      .map((l) =>
        l.type === 'text'
          ? `Text "${l.text}" (${FONTS[l.font ?? 'bold']?.label ?? 'Bold'}, ${l.color})`
          : l.type === 'shape'
            ? `${SHAPES[l.shape ?? 'star'].label} shape (${l.color})`
            : 'Uploaded image (I will send the file separately)',
      )
      .join('; ') || 'nothing';

  const requestQuote = () => {
    const colorName = GARMENT_COLORS.find((c) => c.value === garmentColor)?.name ?? garmentColor;
    const summary = [
      'Design Studio request',
      `Garment: ${g.label}, colour ${colorName}`,
      `Front: ${describe(designs.front)}`,
      g.back ? `Back: ${describe(designs.back)}` : null,
      `View my design: ${shareUrl()}`,
    ]
      .filter(Boolean)
      .join('\n');
    try {
      sessionStorage.setItem(STORAGE_DRAFT, summary);
    } catch {
      /* the quote page will just open without the summary */
    }
    navigate('/virtual-stylist');
  };

  const fieldLabel = 'text-xs font-semibold uppercase tracking-wide text-[#513a5c]';
  const garmentIds = (Object.keys(GARMENTS) as GarmentId[]).filter((id) => available.has(id));

  // In "On a person" view the tee's chest area is mapped onto the model's chest
  const srcArea = side === 'back' ? backArea : frontArea;
  const modelK = Math.min(modelArea.w / srcArea.w, modelArea.h / srcArea.h);
  const designTransform =
    usingModel
      ? `translate(${modelArea.x + modelArea.w / 2} ${modelArea.y + modelArea.h / 2}) scale(${modelK}) translate(${-(srcArea.x + srcArea.w / 2)} ${-(srcArea.y + srcArea.h / 2)})`
      : undefined;

  const tabs: { id: ViewId; label: string; enabled: boolean; hint?: string }[] = [
    { id: 'front', label: 'Front', enabled: true },
    { id: 'back', label: 'Back', enabled: canBack, hint: 'This item has no back print' },
    { id: 'model', label: 'On a person', enabled: canModel, hint: 'Shown for the T-shirt for now' },
  ];

  return (
    <main className="min-h-screen bg-[#f3eff5] pb-20 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
            <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
            Design studio
          </p>
          <AnimatedHeading
            variant="pop"
            className="mt-3 text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em] text-[#211527]"
            lines={[{ text: 'Design your own.' }]}
          />
          <p className="mt-3 text-base text-[#513a5c]">
            Pick a garment and colour, add your logo or text, then drag, resize and rotate it. Check the front, the back and how it looks on a
            person. Share it, or send it to us for a quote.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          {/* Stage */}
          <section aria-label="Preview" className="rounded-[2rem] bg-white p-4 ring-1 ring-[#211527]/10 sm:p-6">
            <div className="mb-4 flex justify-center">
              <div className="inline-flex gap-1 rounded-full border border-[#211527]/15 bg-white p-1" role="tablist" aria-label="View">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={activeView === t.id}
                    disabled={!t.enabled}
                    title={t.enabled ? undefined : t.hint}
                    onClick={() => {
                      setView(t.id);
                      setSelectedId(null);
                    }}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-35 ${
                      activeView === t.id ? 'bg-[#211527] text-white' : 'text-[#513a5c] hover:text-[#211527]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {activeView === 'model' && (
              <div className="mb-3 flex justify-center">
                <div className="inline-flex gap-1 rounded-full bg-[#f3eff5] p-1" role="group" aria-label="Side on a person">
                  {(['front', 'back'] as Side[]).map((sd) => (
                    <button
                      key={sd}
                      type="button"
                      aria-pressed={modelSide === sd}
                      onClick={() => setModelSide(sd)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        modelSide === sd ? 'bg-white text-[#211527] shadow-sm' : 'text-[#513a5c]'
                      }`}
                    >
                      {sd === 'front' ? 'Front' : 'Back'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              className="mx-auto w-full max-w-[34rem] overflow-hidden rounded-[1.5rem]"
              style={{ backgroundImage: 'radial-gradient(90% 70% at 50% 35%, #fad0e1 0%, #f2ceff 45%, #cfdcff 100%)' }}
            >
              <svg
                ref={svgRef}
                viewBox="0 0 400 480"
                role="img"
                aria-label={`${g.label} ${activeView} preview`}
                className="block h-auto w-full touch-none select-none"
                onPointerMove={onMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerDown={() => setSelectedId(null)}
              >
                <defs>
                  <clipPath id="print-clip">
                    <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} />
                  </clipPath>
                </defs>

                {!usingModel && <ellipse cx="200" cy="462" rx="120" ry="8" fill="#211527" opacity="0.12" />}
                {tinted && !photoError && (
                  <image href={tinted.url} x={frame.x} y={frame.y} width={frame.w} height={frame.h} preserveAspectRatio="xMidYMid meet" />
                )}
                {photoError && (
                  <text x="200" y="240" textAnchor="middle" fill="#211527" fontSize="14">
                    Could not load the garment photo
                  </text>
                )}

                {activeView !== 'model' && (
                  <g data-ui pointerEvents="none">
                    <rect x="14" y="14" width={activeView === 'back' ? 58 : 64} height="24" rx="12" fill="#211527" />
                    <text x={activeView === 'back' ? 43 : 46} y="30" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
                      {activeView === 'back' ? 'BACK' : 'FRONT'}
                    </text>
                  </g>
                )}

                {/* print area guide */}
                {editable && (
                  <rect
                    data-ui
                    x={area.x}
                    y={area.y}
                    width={area.w}
                    height={area.h}
                    rx="10"
                    fill="none"
                    stroke={isLight ? '#211527' : '#ffffff'}
                    strokeOpacity="0.35"
                    strokeDasharray="5 5"
                  />
                )}

                <g clipPath="url(#print-clip)" transform={designTransform}>
                  {layers.map((l) => {
                    const b = box(l);
                    return (
                      <g
                        key={l.id}
                        transform={`translate(${l.x} ${l.y}) rotate(${l.rotate})`}
                        onPointerDown={(e) => onLayerDown(e, l)}
                        style={{ cursor: editable ? 'grab' : 'default', pointerEvents: editable ? 'auto' : 'none' }}
                      >
                        {l.type === 'text' && (
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={l.color}
                            fontSize={30 * l.scale}
                            fontFamily={FONTS[l.font ?? 'bold']?.css}
                            fontWeight={FONTS[l.font ?? 'bold']?.weight}
                            fontStyle={FONTS[l.font ?? 'bold']?.italic ? 'italic' : 'normal'}
                          >
                            {l.text}
                          </text>
                        )}
                        {l.type === 'shape' && (
                          <path d={SHAPES[l.shape ?? 'star'].d} fill={l.color} fillRule="evenodd" transform={`scale(${l.scale})`} />
                        )}
                        {l.type === 'image' && l.src && (
                          <image href={l.src} x={-b.w / 2} y={-b.h / 2} width={b.w} height={b.h} preserveAspectRatio="xMidYMid meet" />
                        )}
                        <rect x={-b.w / 2 - 6} y={-b.h / 2 - 6} width={b.w + 12} height={b.h + 12} fill="transparent" />
                      </g>
                    );
                  })}
                </g>

                {/* selection frame and handles, drawn outside the clip so they never get cut off */}
                {selected && (
                  <g data-ui transform={`translate(${selected.x} ${selected.y}) rotate(${selected.rotate})`}>
                    {(() => {
                      const b = box(selected);
                      return (
                        <>
                          <rect
                            x={-b.w / 2 - 4}
                            y={-b.h / 2 - 4}
                            width={b.w + 8}
                            height={b.h + 8}
                            rx="6"
                            fill="none"
                            stroke="#7c4dff"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                            pointerEvents="none"
                          />
                          <line x1="0" y1={-b.h / 2 - 4} x2="0" y2={-b.h / 2 - 20} stroke="#7c4dff" strokeWidth="1.5" pointerEvents="none" />
                          {/* delete button */}
                          <g
                            style={{ cursor: 'pointer' }}
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              removeLayer(selected.id);
                            }}
                          >
                            <circle cx={-b.w / 2 - 4} cy={-b.h / 2 - 4} r="11" fill="#d7263d" stroke="#fff" strokeWidth="2" />
                            <path
                              d={`M${-b.w / 2 - 8} ${-b.h / 2 - 8}l8 8m0-8l-8 8`}
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              pointerEvents="none"
                            />
                          </g>
                          <circle
                            cx="0"
                            cy={-b.h / 2 - 22}
                            r="14"
                            fill="transparent"
                            style={{ cursor: 'grab' }}
                            onPointerDown={(e) => onRotateDown(e, selected)}
                          />
                          <circle cx="0" cy={-b.h / 2 - 22} r="6" fill="#fff" stroke="#7c4dff" strokeWidth="2" pointerEvents="none" />
                          <circle
                            cx={b.w / 2 + 4}
                            cy={b.h / 2 + 4}
                            r="14"
                            fill="transparent"
                            style={{ cursor: 'nwse-resize' }}
                            onPointerDown={(e) => onScaleDown(e, selected)}
                          />
                          <rect
                            x={b.w / 2 - 2}
                            y={b.h / 2 - 2}
                            width="12"
                            height="12"
                            rx="3"
                            fill="#7c4dff"
                            stroke="#fff"
                            strokeWidth="2"
                            pointerEvents="none"
                          />
                        </>
                      );
                    })()}
                  </g>
                )}
              </svg>
            </div>

            <p className="mx-auto mt-3 max-w-[34rem] text-center text-xs text-[#6b5a73]" aria-live="polite">
              {activeView === 'model'
                ? flatModel
                  ? 'No back photo of a person yet, so the back is shown on the flat T-shirt. Add model-tee-back.jpg to public/design to see it worn.'
                  : 'Preview on a person. Switch the main tab to Front or Back to edit.'
                : activeView === 'back' && !useRealBack
                  ? 'Back view: placement guide on the front photo. A real back photo can be added.'
                  : 'Drag to move. Pull the square corner to resize and the round handle to rotate.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={downloadPng}
                className="inline-flex items-center gap-2 rounded-full border border-[#211527]/20 bg-white px-5 py-3 text-sm font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white"
              >
                <Download size={16} aria-hidden />
                Download picture
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-full border border-[#211527]/20 bg-white px-5 py-3 text-sm font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white"
              >
                <Link2 size={16} aria-hidden />
                Copy share link
              </button>
              <button
                type="button"
                onClick={requestQuote}
                className="inline-flex items-center gap-2 rounded-full bg-[#211527] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#33203f]"
              >
                Request a quote
                <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          </section>

          {/* Controls */}
          <section aria-label="Design tools" className="space-y-4">
            <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#211527]/10">
              <p className={fieldLabel}>Garment</p>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Garment">
                {garmentIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={garment === id}
                    onClick={() => switchGarment(id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      garment === id ? 'bg-[#211527] text-white' : 'border border-[#211527]/20 text-[#211527] hover:bg-[#f2ceff]/50'
                    }`}
                  >
                    {GARMENTS[id].label}
                  </button>
                ))}
              </div>

              <p className={`${fieldLabel} mt-5`}>Colour</p>
              <div className="mt-3 flex flex-wrap gap-2.5" role="group" aria-label="Garment colour">
                {GARMENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    aria-label={c.name}
                    aria-pressed={garmentColor === c.value}
                    title={c.name}
                    onClick={() => setGarmentColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`h-9 w-9 rounded-full ring-offset-2 transition ${
                      garmentColor === c.value ? 'ring-2 ring-[#211527]' : 'ring-1 ring-[#211527]/20 hover:ring-[#211527]/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#211527]/10">
              <p className={fieldLabel}>Add to the {side === 'back' ? 'back' : 'front'}</p>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  addText();
                }}
              >
                <label htmlFor="studio-text" className="sr-only">
                  Text to add
                </label>
                <input
                  id="studio-text"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  maxLength={40}
                  placeholder="Type something"
                  className="min-w-0 flex-1 rounded-full border border-[#211527]/20 bg-white px-5 py-3 text-sm text-[#211527] outline-none transition placeholder:text-[#211527]/45 focus:border-[#211527] focus:ring-2 focus:ring-[#f2ceff]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#211527] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#33203f]"
                >
                  <Type size={16} aria-hidden />
                  Add
                </button>
              </form>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#7c4dff] px-5 text-sm font-semibold text-white transition hover:bg-[#6a3de8]"
                >
                  <ImagePlus size={16} aria-hidden />
                  Upload your design
                </button>
                {(Object.keys(SHAPES) as ShapeId[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addShape(s)}
                    aria-label={`Add ${SHAPES[s].label}`}
                    title={SHAPES[s].label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[#211527]/20 bg-white transition hover:bg-[#f2ceff]/50"
                  >
                    <svg viewBox="-36 -36 72 72" className="h-6 w-6" aria-hidden>
                      <path d={SHAPES[s].d} fill="#211527" fillRule="evenodd" />
                    </svg>
                  </button>
                ))}
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onFile} />
              </div>
              <p className="mt-3 text-xs text-[#6b5a73]">
                PNG, JPG or WebP up to 2 MB. A logo with a clear background looks best. Images are not saved in share links.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#211527]/10">
              <p className={fieldLabel}>On the {side === 'back' ? 'back' : 'front'} ({layers.length})</p>
              {layers.length === 0 ? (
                <p className="mt-3 text-sm text-[#6b5a73]">Nothing here yet. Add text, a shape or upload your design above.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {layers.map((l) => (
                    <li key={l.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (view === 'model') setView('front');
                          setSelectedId(l.id);
                        }}
                        aria-pressed={selectedId === l.id}
                        className={`min-w-0 flex-1 truncate rounded-full border px-4 py-2 text-left text-sm transition ${
                          selectedId === l.id ? 'border-[#211527] bg-[#f2ceff]/50 font-semibold' : 'border-[#211527]/15 hover:bg-[#f3eff5]'
                        }`}
                      >
                        {l.type === 'text' ? `Text: ${l.text || '(empty)'}` : l.type === 'shape' ? `${SHAPES[l.shape ?? 'star'].label} shape` : 'Your uploaded design'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLayer(l.id)}
                        aria-label="Delete this item"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-red-200 text-red-700 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {layers.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setDesigns((d) => ({ ...d, [side]: [] }));
                    setSelectedId(null);
                  }}
                  className="mt-3 text-xs font-semibold text-[#6b4a7a] underline underline-offset-2"
                >
                  Clear the {side === 'back' ? 'back' : 'front'}
                </button>
              )}
            </div>

            <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#211527]/10" aria-live="polite">
              <p className={fieldLabel}>Selected item</p>
              {selected ? (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6b5a73]">Size</span>
                    <button
                      type="button"
                      onClick={() => nudgeSize(-0.1)}
                      aria-label="Make smaller"
                      className="grid h-10 w-10 place-items-center rounded-full border border-[#211527]/20 transition hover:bg-[#211527] hover:text-white"
                    >
                      <Minus size={16} aria-hidden />
                    </button>
                    <span className="min-w-[3rem] text-center text-sm font-semibold tabular-nums">{Math.round(selected.scale * 100)}%</span>
                    <button
                      type="button"
                      onClick={() => nudgeSize(0.1)}
                      aria-label="Make bigger"
                      className="grid h-10 w-10 place-items-center rounded-full border border-[#211527]/20 transition hover:bg-[#211527] hover:text-white"
                    >
                      <Plus size={16} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={centreSelected}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#211527]/20 px-3.5 py-2.5 text-xs font-semibold transition hover:bg-[#211527] hover:text-white"
                    >
                      <Crosshair size={14} aria-hidden />
                      Centre
                    </button>
                  </div>

                  {selected.type === 'text' && (
                    <>
                      <div>
                        <label htmlFor="sel-text" className="mb-1.5 block text-xs text-[#6b5a73]">
                          Text
                        </label>
                        <input
                          id="sel-text"
                          value={selected.text ?? ''}
                          maxLength={40}
                          onChange={(e) => update(selected.id, { text: e.target.value })}
                          className="w-full rounded-full border border-[#211527]/20 bg-white px-5 py-3 text-sm text-[#211527] outline-none transition focus:border-[#211527] focus:ring-2 focus:ring-[#f2ceff]"
                        />
                      </div>
                      <div>
                        <span id="sel-font" className="mb-1.5 block text-xs text-[#6b5a73]">
                          Font
                        </span>
                        <SelectMenu
                          labelledBy="sel-font"
                          value={selected.font ?? 'bold'}
                          onChange={(v) => update(selected.id, { font: v })}
                          options={Object.entries(FONTS).map(([value, f]) => ({ value, label: f.label }))}
                        />
                      </div>
                    </>
                  )}

                  {selected.type !== 'image' && (
                    <div>
                      <span className="mb-1.5 block text-xs text-[#6b5a73]">Colour</span>
                      <div className="flex flex-wrap gap-2" role="group" aria-label="Item colour">
                        {INK_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            aria-label={`Colour ${c}`}
                            aria-pressed={selected.color === c}
                            onClick={() => update(selected.id, { color: c })}
                            style={{ backgroundColor: c }}
                            className={`h-7 w-7 rounded-full ring-offset-2 transition ${
                              selected.color === c ? 'ring-2 ring-[#211527]' : 'ring-1 ring-[#211527]/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="sel-rot" className="mb-1.5 flex justify-between text-xs text-[#6b5a73]">
                      <span>Rotate</span>
                      <span className="tabular-nums">{Math.round(selected.rotate)}°</span>
                    </label>
                    <input
                      id="sel-rot"
                      type="range"
                      min={-180}
                      max={180}
                      step={1}
                      value={selected.rotate}
                      onChange={(e) => update(selected.id, { rotate: Number(e.target.value) })}
                      className="w-full accent-[#211527]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLayer(selected.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    <Trash2 size={15} aria-hidden />
                    Remove item
                  </button>
                </div>
              ) : (
                <p className="mt-3 flex items-start gap-2 text-sm text-[#6b5a73]">
                  <Plus size={16} className="mt-0.5 shrink-0" aria-hidden />
                  {editable
                    ? 'Tap an item on the garment to move, resize or rotate it, or add something new above.'
                    : 'Switch to Front or Back to edit your design.'}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DesignStudioPage;
