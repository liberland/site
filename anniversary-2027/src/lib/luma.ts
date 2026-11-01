/* Luma embedded checkout — the official script, loaded once, only when tickets are live.
   Docs: https://help.luma.com/p/embed-luma-on-your-website
   The script binds `onclick` on every [data-luma-action="checkout"] element and opens Luma's checkout overlay
   (an iframe on luma.com; payment by Stripe inside Luma). If the script is blocked or fails, the buttons stay
   plain links to the Luma event page, so visitors are never stuck. */
import { useEffect, useState } from 'react';

const SRC = 'https://embed.lu.ma/checkout-button.js';
/** Luma's script finds its own origin through this exact id. */
const ID = 'luma-checkout';

type LumaWindow = Window & { luma?: { initCheckout?: () => void } };
export type LumaState = 'idle' | 'loading' | 'ready' | 'failed';

let state: LumaState = 'idle';
const listeners = new Set<(s: LumaState) => void>();
const set = (s: LumaState) => { state = s; listeners.forEach((l) => l(s)); };

/** Re-bind checkout buttons rendered after the script loaded. */
export function bindCheckout() {
  (window as LumaWindow).luma?.initCheckout?.();
}

function load() {
  if (state !== 'idle' || typeof document === 'undefined') return;
  set('loading');
  if (document.getElementById(ID)) { set('ready'); return; }
  const s = document.createElement('script');
  s.id = ID;
  s.src = SRC;
  s.async = true;
  s.onload = () => {
    if ((window as LumaWindow).luma?.initCheckout) { bindCheckout(); set('ready'); }
    else set('failed');
  };
  s.onerror = () => set('failed');
  document.head.appendChild(s);
  // A blocked script (privacy extensions) sometimes neither loads nor errors.
  window.setTimeout(() => { if (state === 'loading') set('failed'); }, 10000);
  enhanceOverlay();
}

/** Escape closes Luma's overlay (the script itself only closes on click) and focus returns to the button. */
function enhanceOverlay() {
  let opener: HTMLElement | null = null;
  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-luma-action="checkout"]');
    if (t) opener = t;
  }, true);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const overlay = document.querySelector('.luma-checkout--overlay');
    if (!overlay) return;
    overlay.remove();
    opener?.focus();
  });
}

/** Loads the checkout script when `enabled`, and reports its state. Call it from every checkout button. */
export function useLumaCheckout(enabled: boolean) {
  const [s, setS] = useState<LumaState>(state);
  useEffect(() => {
    if (!enabled) return;
    listeners.add(setS);
    load();
    setS(state);
    // Bind buttons that mounted after the script was ready (e.g. the sticky bar).
    if (state === 'ready') requestAnimationFrame(bindCheckout);
    return () => { listeners.delete(setS); };
  }, [enabled]);
  return s;
}
