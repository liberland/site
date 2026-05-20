// Shared icons (SVG only) + the Liberland crest mark used in nav and watermarks.
// Exports to window so other Babel scripts can use them.

const Crest = ({ size = 24, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6 L52 12 L52 36 Q52 50 32 58 Q12 50 12 36 L12 12 Z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <path d="M32 14 L46 18.5 L46 35 Q46 45 32 51 Q18 45 18 35 L18 18.5 Z" fill="currentColor" opacity="0.18"/>
    <g transform="translate(32, 32)" fill="currentColor">
      <path d="M0,-9 L2.6,-2.8 L9,-2.8 L3.6,1.1 L5.6,7.4 L0,3.4 L-5.6,7.4 L-3.6,1.1 L-9,-2.8 L-2.6,-2.8 Z"/>
    </g>
  </svg>
);

const ArrowRight = ({ size = 14 }) => (
  <svg className="arrow" width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Check = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Cross = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);

const PhotoSlot = ({ label = "Liberland — Danube riverbank", ref_id = "PH-001", aspect = "4 / 5" }) => (
  <div className="photo-slot" style={{aspectRatio: aspect}}>
    <span className="ps-corner tl">{ref_id}</span>
    <span className="ps-corner br">PLACEHOLDER</span>
    <div className="ps-inner">
      <b>{label}</b>
      Image to be supplied
    </div>
  </div>
);

Object.assign(window, { Crest, ArrowRight, Check, Cross, PhotoSlot });
