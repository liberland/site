import shield from '../assets/shield-64.webp';
import { event } from '../data/anniversary';
import { toRoman } from '../lib/dates';
import { foundingYear } from '../lib/event';

/** The XII anniversary seal — a small decorative device, not a headline. */
export function Seal({ className = 'seal' }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 400 400" focusable="false">
        <defs><path id="sealpath" d="M200,46 a154,154 0 1,1 -0.01,0" /></defs>
        <circle className="seal-disc" cx="200" cy="200" r="198" />
        <circle className="seal-ring" cx="200" cy="200" r="190" />
        <circle className="seal-ring2" cx="200" cy="200" r="122" />
        <g className="seal-rot">
          <text className="seal-text">
            <textPath href="#sealpath" textLength="955" lengthAdjust="spacing">
              {`Liberland · ${toRoman(foundingYear)} – ${toRoman(event.year)} · Anniversary · `}
            </textPath>
          </text>
        </g>
        <image href={shield} x="174" y="112" width="52" height="72" />
        <text className="seal-xii" x="200" y="268" textAnchor="middle">{event.numeral}</text>
      </svg>
    </div>
  );
}
