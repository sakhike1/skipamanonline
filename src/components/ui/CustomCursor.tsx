import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const CANVAS_ID = 'skipaman-fluid-canvas';

function canUseFluidCursor(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Torii Studio–style WebGL fluid smoke (full-screen overlay, normal cursor unchanged).
 */
export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActive(canUseFluidCursor());

    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = () => setActive(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    const start = async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      if (cancelled || !document.getElementById(CANVAS_ID)) return;

      try {
        const { initFluid } = await import('smokey-fluid-cursor');
        if (cancelled || !document.getElementById(CANVAS_ID)) return;

        initFluid({
          id: CANVAS_ID,
          simResolution: 128,
          dyeResolution: 512,
          velocityDissipation: 2.2,
          pressureIteration: 20,
          curl: 22,
          splatRadius: 0.2,
          splatForce: 3800,
          shading: true,
          colorUpdateSpeed: 8,
          densityDissipation: 4.2,
          transparent: true,
          backColor: { r: 0, g: 0, b: 0 },
        });

        const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement | null;
        if (canvas) {
          canvas.style.zIndex = '90';
          canvas.style.pointerEvents = 'none';
        }
      } catch (error) {
        console.error('[CustomCursor] WebGL fluid failed to start:', error);
      }
    };

    start();

    return () => {
      cancelled = true;
    };
  }, [active]);

  if (!mounted || !active) return null;

  return createPortal(
    <canvas id={CANVAS_ID} className="cursor-fluid-canvas" aria-hidden="true" />,
    document.body
  );
}
