import { useEffect, useRef } from 'react';

/**
 * A quiet snowfall over the whole page: a few dozen small, soft flakes drifting
 * slowly on one fixed canvas. Not rendered for reduced-motion users, paused while
 * the tab is hidden, and capped in resolution so it stays cheap on phones.
 */
export function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    type Flake = { x: number; y: number; r: number; vy: number; sway: number; phase: number; a: number };
    let flakes: Flake[] = [];

    const spawn = (anywhere: boolean): Flake => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -6,
      r: 0.8 + Math.random() ** 2 * 2.4, // mostly tiny, a few larger
      vy: 12 + Math.random() * 22, // px per second
      sway: 6 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      a: 0.35 + Math.random() * 0.45,
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(70, Math.max(28, (w * h) / 22000)));
      flakes = flakes.slice(0, target);
      while (flakes.length < target) flakes.push(spawn(true));
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      // set every frame: resizing the canvas resets the context state (fill would turn black)
      ctx.fillStyle = '#fffaf0';
      for (const f of flakes) {
        f.phase += dt * 0.6;
        f.y += f.vy * dt;
        f.x += Math.sin(f.phase) * f.sway * dt;
        if (f.y > h + 6) Object.assign(f, spawn(false));
        if (f.x < -6) f.x = w + 6;
        if (f.x > w + 6) f.x = -6;
        ctx.globalAlpha = f.a;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="snowfall" aria-hidden="true" />;
}
