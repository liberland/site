import escutcheon from '../assets/escutcheon-128.webp';
import { event } from '../data/anniversary';
import { roman, toRoman } from '../lib/dates';
import { foundingYear } from '../lib/event';

/* Dots every 30° on r=148, the first (top) in yellow — positions as in the design. */
const DOTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return { cx: (200 + 148 * Math.sin(a)).toFixed(1), cy: (200 - 148 * Math.cos(a)).toFixed(1), r: i === 0 ? 4 : 2.5 };
});

/** The XII medallion — the one ceremonial device of the design. */
export function Medallion() {
  const years = `${toRoman(foundingYear)} – ${toRoman(event.year)}`;
  return (
    <div
      className="med"
      role="img"
      aria-label={`Anniversary emblem: the Liberland escutcheon above the numeral ${event.numeral}, twelve years, ${foundingYear} to ${event.year}`}
    >
      <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
        <defs>
          <path id="ringpath" d="M200,28 a172,172 0 1,1 -0.01,0" />
        </defs>
        <circle className="med-disc" cx="200" cy="200" r="198" />
        <circle className="med-ring" cx="200" cy="200" r="190" />
        <circle className="med-ring2" cx="200" cy="200" r="156" />
        <g className="med-rot">
          <text className="med-text">
            <textPath href="#ringpath" textLength="1060" lengthAdjust="spacing">
              {`Free Republic of Liberland · The twelfth anniversary · ${years} · `}
            </textPath>
          </text>
        </g>
        <g className="med-dots">
          {DOTS.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />)}
        </g>
      </svg>
      <div className="med-c" aria-hidden="true">
        <img src={escutcheon} width="52" height="72" alt="" />
        <span className="med-xii">{event.numeral}</span>
        <span className="lbl">{event.number}th Anniversary</span>
        <span className="rec">{roman(event.founding.date)}</span>
      </div>
    </div>
  );
}
