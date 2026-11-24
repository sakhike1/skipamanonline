import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Music2, Pause, Play, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

/**
 * Skipaman Radio: an opt-in music player. Nothing plays until the visitor taps play.
 *
 * Only add tracks you have the rights to use (royalty-free, or from an artist who has agreed in
 * writing). Put the files in `public/audio/` and list them below. A vibe with no tracks is hidden,
 * and if no vibe has tracks the whole radio button is hidden, so the site never shows a dead player.
 *
 * Privacy: the only thing stored is the visitor's chosen vibe and volume, in their own browser.
 */
type Track = { title: string; artist: string; src: string };
type Vibe = { id: string; label: string; accent: string; tracks: Track[] };

const VIBES: Vibe[] = [
  { id: 'amapiano', label: 'Amapiano', accent: '#ffd21f', tracks: [{ title: 'Untitled', artist: 'Skipaman', src: '/audio/Untitled.m4a' }] },
  { id: 'hiphop', label: 'Hip-hop', accent: '#8fb0ff', tracks: [
    { title: 'Snoko Noko', artist: 'LINEZ', src: '/audio/LINEZ-SNOKO%20NOKO.mp3' },
    { title: 'Nightmares', artist: 'Chris Brown ft. Byron Messia', src: '/audio/Chris_Brown_ft_Byron_Messia_-_Nightmares.mp3' },
  ] },
  { id: 'chill', label: 'Chill', accent: '#8fe3c8', tracks: [{ title: 'Mastering', artist: 'Skipaman', src: '/audio/mastering.m4a' }] },
];

const STORAGE_KEY = 'skipaman_radio';
const HIDDEN_PREFIXES = ['/admin', '/checkout'];

type Saved = { vibe?: string; volume?: number };

const readSaved = (): Saved => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Saved;
  } catch {
    return {};
  }
};

const writeSaved = (data: Saved) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* private mode: the choice just will not be remembered */
  }
};

const SkipamanRadio: React.FC = () => {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const vibes = VIBES.filter((v) => v.tracks.length > 0);
  const saved = useRef<Saved>(readSaved()).current;

  const [open, setOpen] = useState(false);
  const [vibeId, setVibeId] = useState<string | null>(vibes.find((v) => v.id === saved.vibe)?.id ?? null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(typeof saved.volume === 'number' ? saved.volume : 0.6);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);

  const vibe = vibes.find((v) => v.id === vibeId) ?? null;
  const track = vibe ? vibe.tracks[trackIndex % vibe.tracks.length] : null;

  // While music plays, the site picks up the vibe's colour (nav hover, footer hover, text selection)
  useEffect(() => {
    const root = document.documentElement;
    if (playing && vibe) root.style.setProperty('--vibe-accent', vibe.accent);
    else root.style.removeProperty('--vibe-accent');
    return () => {
      root.style.removeProperty('--vibe-accent');
    };
  }, [playing, vibe]);

  // Keep the audio element in sync with volume / mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Stop audio if the component goes away
  useEffect(() => {
    const el = audioRef.current;
    return () => el?.pause();
  }, []);

  const start = useCallback((src: string) => {
    const el = audioRef.current;
    if (!el) return;
    setFailed(false);
    el.src = src;
    el.volume = volume;
    el.muted = muted;
    el.play().then(
      () => setPlaying(true),
      () => {
        setPlaying(false);
        setFailed(true);
      },
    );
  }, [volume, muted]);

  const pickVibe = (id: string) => {
    const next = vibes.find((v) => v.id === id);
    if (!next) return;
    setVibeId(id);
    setTrackIndex(0);
    writeSaved({ vibe: id, volume });
    start(next.tracks[0].src);
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !track) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else if (el.src) {
      el.play().then(() => setPlaying(true), () => setFailed(true));
    } else {
      start(track.src);
    }
  };

  const next = () => {
    if (!vibe) return;
    const i = (trackIndex + 1) % vibe.tracks.length;
    setTrackIndex(i);
    start(vibe.tracks[i].src);
  };

  const blocked = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (blocked || vibes.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[60] flex flex-col items-end gap-3 sm:right-8">
      {/* One audio element for the whole site; it only plays after the visitor taps */}
      <audio ref={audioRef} preload="none" onEnded={next} onError={() => setFailed(true)} />

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Skipaman Radio"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{ ['--radio-accent' as string]: vibe?.accent ?? '#f2ceff' }}
            className="radio-panel relative w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-white/80 p-5 text-[#211527] shadow-[0_30px_80px_-30px_rgba(33,21,39,0.55),inset_0_1px_0_rgba(255,255,255,0.9)] [&>*:not(.radio-sheen)]:relative"
          >
            <style>{`
              .radio-panel {
                background-image:
                  radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, var(--radio-accent) 55%, white) 0%, transparent 60%),
                  linear-gradient(160deg, color-mix(in srgb, var(--radio-accent) 22%, white), #ffffff 70%);
                transition: background 400ms;
              }
              .radio-sheen {
                position: absolute; inset: 0; pointer-events: none;
                background: linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.65) 50%, transparent 62%);
                transform: translateX(-120%);
                animation: radio-sheen 7s ease-in-out 0.6s infinite;
              }
              @keyframes radio-sheen { 0%, 70% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
              @media (prefers-reduced-motion: reduce) { .radio-sheen { animation: none; opacity: 0; } }
            `}</style>
            <div aria-hidden className="radio-sheen" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b4a7a]">Skipaman Radio</p>
                <p className="mt-1 text-sm text-[#513a5c]">
                  {saved.vibe && vibe && saved.vibe === vibe.id && !playing
                    ? `Last time you picked ${vibe.label}.`
                    : 'Pick a vibe. Plays only when you tap.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close radio"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/70 transition hover:bg-white"
              >
                <X size={16} aria-hidden />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose a vibe">
              {vibes.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => pickVibe(v.id)}
                  aria-pressed={v.id === vibeId}
                  style={v.id === vibeId ? { backgroundColor: v.accent } : undefined}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    v.id === vibeId ? 'text-[#211527] ring-1 ring-[#211527]/30' : 'bg-white/70 text-[#211527] hover:bg-white'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {track && (
              <div className="mt-5 rounded-2xl bg-white/65 p-4 ring-1 ring-white backdrop-blur-sm">
                <p className="truncate text-sm font-semibold">{track.title}</p>
                <p className="truncate text-xs text-[#6b5a73]">{track.artist}</p>
                {failed && <p className="mt-1 text-xs text-red-700">Could not play this track. Try the next one.</p>}

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? 'Pause' : 'Play'}
                    className="grid h-10 w-10 place-items-center rounded-full bg-[#211527] text-white transition hover:bg-[#33203f]"
                  >
                    {playing ? <Pause size={16} aria-hidden /> : <Play size={16} className="translate-x-px" aria-hidden />}
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next track"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white transition hover:bg-[#f2ceff]"
                  >
                    <SkipForward size={16} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? 'Unmute' : 'Mute'}
                    className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white transition hover:bg-[#f2ceff]"
                  >
                    {muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
                  </button>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    writeSaved({ vibe: vibeId ?? undefined, volume: v });
                  }}
                  aria-label="Volume"
                  className="mt-3 w-full accent-[#211527]"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close Skipaman Radio' : 'Open Skipaman Radio'}
        className="relative grid h-12 w-12 place-items-center rounded-full bg-[#211527] text-white shadow-[0_14px_30px_-12px_rgba(33,21,39,0.8)] transition hover:scale-105 hover:bg-[#33203f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]"
      >
        <Music2 size={20} aria-hidden />
        {playing && vibe && (
          <span
            aria-hidden
            className="absolute -right-1 -top-1 flex h-5 items-end gap-[2px] rounded-full border-2 border-white px-1 py-[3px]"
            style={{ backgroundColor: vibe.accent }}
          >
            {[0, 0.2, 0.4].map((d) => (
              <span
                key={d}
                className="h-full w-[2px] origin-bottom rounded-full bg-[#211527] motion-reduce:!animate-none"
                style={{ animation: `radio-eq 0.9s ease-in-out ${d}s infinite` }}
              />
            ))}
          </span>
        )}
      </button>
    </div>
  );
};

export default SkipamanRadio;
