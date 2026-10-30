/* Original line drawings from the approved design ("Palace & Ledger").
   Converted from the design board markup; original work, no third-party rights.
   All are decorative: callers pass aria-hidden. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export function HeroFacade(props: P) {
  return (
<svg {...props} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6DFA6" />
          <stop offset=".55" stopColor="#E2B467" />
          <stop offset="1" stopColor="#B9823F" />
        </linearGradient>
        <linearGradient id="fac" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101B2E" />
          <stop offset="1" stopColor="#0B1424" />
        </linearGradient>
        <radialGradient id="glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#F3D493" stopOpacity=".55" />
          <stop offset="1" stopColor="#F3D493" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="rings" fill="none" stroke="#D6B571">
        <circle cx="720" cy="330" r="250" strokeOpacity=".18" strokeDasharray="2 7" />
        <circle cx="720" cy="330" r="340" strokeOpacity=".14" />
        <circle cx="720" cy="330" r="430" strokeOpacity=".12" strokeDasharray="1 12" />
        <circle cx="720" cy="330" r="540" strokeOpacity=".09" />
        <circle cx="720" cy="330" r="660" strokeOpacity=".07" strokeDasharray="40 14 4 14" />
        <circle cx="720" cy="80" r="3" fill="#D6B571" fillOpacity=".7" stroke="none" />
        <circle cx="1060" cy="330" r="3" fill="#D6B571" fillOpacity=".6" stroke="none" />
        <circle cx="416" cy="96" r="2.5" fill="#D6B571" fillOpacity=".6" stroke="none" />
        <circle cx="290" cy="330" r="2.5" fill="#D6B571" fillOpacity=".5" stroke="none" />
      </g>
      <ellipse cx="720" cy="860" rx="520" ry="160" fill="url(#glow)" />
      <g>
        <rect x="330" y="470" width="780" height="430" fill="url(#fac)" stroke="#D6B571" strokeOpacity=".55" strokeWidth="1" />
        <line x1="316" y1="470" x2="1124" y2="470" stroke="#D6B571" strokeOpacity=".5" />
        <line x1="316" y1="478" x2="1124" y2="478" stroke="#D6B571" strokeOpacity=".5" />
        <line x1="316" y1="620" x2="1124" y2="620" stroke="#D6B571" strokeOpacity=".5" />
        <line x1="316" y1="760" x2="1124" y2="760" stroke="#D6B571" strokeOpacity=".5" />
        <path d="M324 470 L370 392 L1070 392 L1116 470 Z" fill="#0B1322" stroke="#D6B571" strokeOpacity=".5" />
        <path d="M600 392 L600 330 Q600 220 720 196 Q840 220 840 330 L840 392 Z" fill="#0B1322" stroke="#D6B571" strokeOpacity=".6" />
        <path d="M660 330 Q720 214 780 330" fill="none" stroke="#D6B571" strokeOpacity=".35" />
        <path d="M630 392 L630 340 M810 392 L810 340" stroke="#D6B571" strokeOpacity=".3" />
        <path d="M694 392 L694 350 A26 26 0 0 1 746 350 L746 392 Z" fill="url(#win)" fillOpacity=".85" stroke="#D6B571" strokeOpacity=".6" />
        <line x1="720" y1="196" x2="720" y2="150" stroke="#D6B571" strokeOpacity=".7" />
        <circle cx="720" cy="146" r="4" fill="#EBD7A6" />
        <path d="M369.7 466 L369.7 430 A16 16 0 0 1 401.7 430 L401.7 466 Z" fill="url(#win)" fillOpacity=".55" stroke="#D6B571" strokeOpacity=".5" />
        <path d="M481.1 466 L481.1 430 A16 16 0 0 1 513.1 430 L513.1 466 Z" fill="url(#win)" fillOpacity=".55" stroke="#D6B571" strokeOpacity=".5" />
        <path d="M592.6 466 L592.6 430 A16 16 0 0 1 624.6 430 L624.6 466 Z" fill="#0A1220" stroke="#D6B571" strokeOpacity=".5" />
        <path d="M815.4 466 L815.4 430 A16 16 0 0 1 847.4 430 L847.4 466 Z" fill="url(#win)" fillOpacity=".55" stroke="#D6B571" strokeOpacity=".5" />
        <path d="M926.9 466 L926.9 430 A16 16 0 0 1 958.9 430 L958.9 466 Z" fill="#0A1220" stroke="#D6B571" strokeOpacity=".5" />
        <path d="M1038.3 466 L1038.3 430 A16 16 0 0 1 1070.3 430 L1070.3 466 Z" fill="url(#win)" fillOpacity=".55" stroke="#D6B571" strokeOpacity=".5" />
        <g stroke="#D6B571" strokeOpacity=".22">
          <line x1="330" y1="478" x2="330" y2="760" /><line x1="441.4" y1="478" x2="441.4" y2="760" /><line x1="552.9" y1="478" x2="552.9" y2="760" /><line x1="664.3" y1="478" x2="664.3" y2="760" /><line x1="775.7" y1="478" x2="775.7" y2="760" /><line x1="887.1" y1="478" x2="887.1" y2="760" /><line x1="998.6" y1="478" x2="998.6" y2="760" /><line x1="1110" y1="478" x2="1110" y2="760" />
        </g>
        <g stroke="#D6B571" strokeOpacity=".6">
          <path d="M362.7 592 L362.7 523 A23 23 0 0 1 408.7 523 L408.7 592 Z" fill="#0A1220" />
          <path d="M474.1 592 L474.1 523 A23 23 0 0 1 520.1 523 L520.1 592 Z" fill="url(#win)" />
          <path d="M585.6 592 L585.6 523 A23 23 0 0 1 631.6 523 L631.6 592 Z" fill="#0A1220" />
          <path d="M697 592 L697 523 A23 23 0 0 1 743 523 L743 592 Z" fill="url(#win)" />
          <path d="M808.4 592 L808.4 523 A23 23 0 0 1 854.4 523 L854.4 592 Z" fill="#0A1220" />
          <path d="M919.9 592 L919.9 523 A23 23 0 0 1 965.9 523 L965.9 592 Z" fill="url(#win)" />
          <path d="M1031.3 592 L1031.3 523 A23 23 0 0 1 1077.3 523 L1077.3 592 Z" fill="url(#win)" />
          <path d="M362.7 732 L362.7 663 A23 23 0 0 1 408.7 663 L408.7 732 Z" fill="url(#win)" />
          <path d="M474.1 732 L474.1 663 A23 23 0 0 1 520.1 663 L520.1 732 Z" fill="#0A1220" />
          <path d="M585.6 732 L585.6 663 A23 23 0 0 1 631.6 663 L631.6 732 Z" fill="url(#win)" />
          <path d="M697 732 L697 663 A23 23 0 0 1 743 663 L743 732 Z" fill="url(#win)" />
          <path d="M808.4 732 L808.4 663 A23 23 0 0 1 854.4 663 L854.4 732 Z" fill="url(#win)" />
          <path d="M919.9 732 L919.9 663 A23 23 0 0 1 965.9 663 L965.9 732 Z" fill="#0A1220" />
          <path d="M1031.3 732 L1031.3 663 A23 23 0 0 1 1077.3 663 L1077.3 732 Z" fill="url(#win)" />
          <path d="M358.7 882 L358.7 809 A27 27 0 0 1 412.7 809 L412.7 882 Z" fill="#0A1220" />
          <path d="M470.1 882 L470.1 809 A27 27 0 0 1 524.1 809 L524.1 882 Z" fill="url(#win)" />
          <path d="M581.6 882 L581.6 809 A27 27 0 0 1 635.6 809 L635.6 882 Z" fill="url(#win)" />
          <path d="M693 882 L693 809 A27 27 0 0 1 747 809 L747 882 Z" fill="url(#win)" />
          <path d="M804.4 882 L804.4 809 A27 27 0 0 1 858.4 809 L858.4 882 Z" fill="url(#win)" />
          <path d="M915.9 882 L915.9 809 A27 27 0 0 1 969.9 809 L969.9 882 Z" fill="url(#win)" />
          <path d="M1027.3 882 L1027.3 809 A27 27 0 0 1 1081.3 809 L1081.3 882 Z" fill="#0A1220" />
        </g>
        <g stroke="#D6B571" strokeOpacity=".45">
          <line x1="356.7" y1="600" x2="414.7" y2="600" /><line x1="468.1" y1="600" x2="526.1" y2="600" /><line x1="579.6" y1="600" x2="637.6" y2="600" /><line x1="691" y1="600" x2="749" y2="600" /><line x1="802.4" y1="600" x2="860.4" y2="600" /><line x1="913.9" y1="600" x2="971.9" y2="600" /><line x1="1025.3" y1="600" x2="1083.3" y2="600" />
          <line x1="356.7" y1="740" x2="414.7" y2="740" /><line x1="468.1" y1="740" x2="526.1" y2="740" /><line x1="579.6" y1="740" x2="637.6" y2="740" /><line x1="691" y1="740" x2="749" y2="740" /><line x1="802.4" y1="740" x2="860.4" y2="740" /><line x1="913.9" y1="740" x2="971.9" y2="740" /><line x1="1025.3" y1="740" x2="1083.3" y2="740" />
        </g>
        <path d="M650 782 Q720 744 790 782" fill="none" stroke="#EBD7A6" strokeOpacity=".8" strokeWidth="1.5" />
      </g>
      <g fill="none" stroke="#EBD7A6" strokeOpacity=".5" strokeDasharray="2 5">
        <path d="M497 555 L720 555 L943 555 L1054 555" />
        <path d="M720 555 L720 695 L831 695 L1054 695" />
        <path d="M386 695 L609 695 L720 695" />
        <path d="M497 842 L609 842 L720 842 L831 842 L943 842" />
        <path d="M497 555 L386 695 L497 842" />
        <path d="M943 555 L831 695 L943 842" />
        <path d="M720 371 L720 555" />
      </g>
      <g fill="none" stroke="#D6B571" strokeOpacity=".28">
        <path d="M720 146 L416 96 L290 330" />
        <path d="M720 146 L720 80" />
        <path d="M720 146 L1060 330 L1180 520" />
      </g>
      <g fill="#F6DFA6">
        <circle cx="497" cy="555" r="2.6" /><circle cx="720" cy="555" r="2.6" /><circle cx="943" cy="555" r="2.6" /><circle cx="1054" cy="555" r="2.6" />
        <circle cx="386" cy="695" r="2.6" /><circle cx="609" cy="695" r="2.6" /><circle cx="720" cy="695" r="2.6" /><circle cx="831" cy="695" r="2.6" /><circle cx="1054" cy="695" r="2.6" />
        <circle cx="497" cy="842" r="2.6" /><circle cx="609" cy="842" r="2.6" /><circle cx="720" cy="842" r="2.6" /><circle cx="831" cy="842" r="2.6" /><circle cx="943" cy="842" r="2.6" />
      </g>
    </svg>
  );
}

export function ColonnadeArt(props: P) {
  return (
<svg {...props} viewBox="0 0 320 240" fill="none" stroke="#D6B571">
              <path d="M60 84 L160 34 L260 84 Z" strokeOpacity=".8" />
              <path d="M88 76 L160 42 L232 76" strokeOpacity=".35" />
              <line x1="52" y1="90" x2="268" y2="90" strokeOpacity=".8" />
              <line x1="52" y1="96" x2="268" y2="96" strokeOpacity=".4" />
              <g strokeOpacity=".75">
                <path d="M76 100 V188 M90 100 V188" /><path d="M114 100 V188 M128 100 V188" /><path d="M152 100 V188 M166 100 V188" /><path d="M190 100 V188 M204 100 V188" /><path d="M228 100 V188 M242 100 V188" />
              </g>
              <line x1="44" y1="194" x2="276" y2="194" strokeOpacity=".8" />
              <line x1="34" y1="204" x2="286" y2="204" strokeOpacity=".55" />
              <line x1="24" y1="214" x2="296" y2="214" strokeOpacity=".35" />
              <circle cx="160" cy="66" r="7" strokeOpacity=".9" />
              <circle cx="160" cy="66" r="2" fill="#D6B571" stroke="none" />
            </svg>
  );
}

export function MeritArt(props: P) {
  return (
<svg {...props} viewBox="0 0 320 240" fill="none" stroke="#D6B571">
              <g className="spin">
                <circle cx="160" cy="120" r="104" strokeOpacity=".25" strokeDasharray="2 6" />
                <circle cx="160" cy="120" r="80" strokeOpacity=".4" />
                <circle cx="76" cy="66" r="4" fill="#D6B571" stroke="none" fillOpacity=".8" />
                <circle cx="252" cy="160" r="4" fill="#D6B571" stroke="none" fillOpacity=".8" />
                <circle cx="210" cy="40" r="3" fill="#D6B571" stroke="none" fillOpacity=".6" />
              </g>
              <circle cx="160" cy="120" r="54" strokeOpacity=".7" />
              <circle cx="160" cy="120" r="28" strokeOpacity=".9" />
              <path d="M160 104 L174 130 L146 130 Z" fill="#D6B571" stroke="none" />
              <path d="M76 66 L132 104 M252 160 L188 132" strokeOpacity=".35" strokeDasharray="2 4" />
            </svg>
  );
}

export function ChainArt(props: P) {
  return (
<svg {...props} viewBox="0 0 320 240" fill="none" stroke="#D6B571">
              <line x1="20" y1="200" x2="300" y2="200" strokeOpacity=".3" />
              <g strokeOpacity=".75">
                <path d="M70 110 L96 125 L70 140 L44 125 Z" fill="rgba(214,181,113,.12)" /><path d="M44 125 L70 140 L70 170 L44 155 Z" /><path d="M70 140 L96 125 L96 155 L70 170 Z" />
                <path d="M135 82 L161 97 L135 112 L109 97 Z" fill="rgba(214,181,113,.12)" /><path d="M109 97 L135 112 L135 142 L109 127 Z" /><path d="M135 112 L161 97 L161 127 L135 142 Z" />
                <path d="M200 54 L226 69 L200 84 L174 69 Z" fill="rgba(214,181,113,.12)" /><path d="M174 69 L200 84 L200 114 L174 99 Z" /><path d="M200 84 L226 69 L226 99 L200 114 Z" />
              </g>
              <g stroke="#EBD7A6" strokeDasharray="3 4">
                <path d="M265 26 L291 41 L265 56 L239 41 Z" /><path d="M239 41 L265 56 L265 86 L239 71 Z" /><path d="M265 56 L291 41 L291 71 L265 86 Z" />
              </g>
              <path d="M96 140 L109 127 M161 112 L174 99 M226 84 L239 71" strokeOpacity=".6" />
              <text x="44" y="192" fill="#D6B571" fillOpacity=".7" stroke="none" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.5">CURRENT CHAIN</text>
              <text x="222" y="108" fill="#EBD7A6" stroke="none" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.5">V2 · PLANNED</text>
            </svg>
  );
}

export function FacadeSketch(props: P) {
  return (
<svg {...props} viewBox="0 0 800 640" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#D6B571">
          <path d="M120 640 L120 260 L240 190 L560 190 L680 260 L680 640" strokeOpacity=".3" />
          <path d="M330 190 Q400 90 470 190" strokeOpacity=".3" />
          <g strokeOpacity=".22"><path d="M170 330 h60 v80 h-60z M270 330 h60 v80 h-60z M370 330 h60 v80 h-60z M470 330 h60 v80 h-60z M570 330 h60 v80 h-60z" /><path d="M170 460 h60 v80 h-60z M270 460 h60 v80 h-60z M370 460 h60 v80 h-60z M470 460 h60 v80 h-60z M570 460 h60 v80 h-60z" /></g>
        </svg>
  );
}

export function CeilingSketch(props: P) {
  return (
<svg {...props} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#D6B571">
          <circle cx="200" cy="40" r="90" strokeOpacity=".25" /><circle cx="200" cy="40" r="130" strokeOpacity=".18" strokeDasharray="2 6" /><circle cx="200" cy="40" r="170" strokeOpacity=".12" />
        </svg>
  );
}

export function SkylineSketch(props: P) {
  return (
<svg {...props} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#D6B571">
          <path d="M0 210 L40 210 L40 170 L70 170 L70 150 L90 120 L110 150 L110 190 L160 190 L160 160 L190 160 L190 130 L200 100 L210 130 L210 175 L260 175 L260 140 L300 140 L300 200 L340 200 L340 165 L400 165" strokeOpacity=".35" />
        </svg>
  );
}

export function Chandelier(props: P) {
  return (
<svg {...props} viewBox="0 0 520 520" fill="none">
    <g stroke="#EBD7A6" strokeLinecap="round">
      <circle cx="260" cy="260" r="60" strokeWidth="3" strokeDasharray="0 14" strokeOpacity=".9" />
      <circle cx="260" cy="260" r="110" strokeWidth="3" strokeDasharray="0 18" strokeOpacity=".7" />
      <circle cx="260" cy="260" r="165" strokeWidth="2.5" strokeDasharray="0 22" strokeOpacity=".5" />
      <circle cx="260" cy="260" r="225" strokeWidth="2" strokeDasharray="0 26" strokeOpacity=".3" />
    </g>
    <circle cx="260" cy="260" r="240" fill="url(#chGlow)" />
    <defs><radialGradient id="chGlow"><stop offset="0" stopColor="#F3D493" stopOpacity=".35" /><stop offset="1" stopColor="#F3D493" stopOpacity="0" /></radialGradient></defs>
  </svg>
  );
}

export function FinaleRings(props: P) {
  return (
<svg {...props} viewBox="0 0 1400 1400" fill="none" stroke="#D6B571">
      <circle cx="700" cy="700" r="260" strokeOpacity=".22" />
      <circle cx="700" cy="700" r="360" strokeOpacity=".16" strokeDasharray="2 8" />
      <circle cx="700" cy="700" r="470" strokeOpacity=".12" />
      <circle cx="700" cy="700" r="580" strokeOpacity=".09" strokeDasharray="60 18 4 18" />
      <circle cx="700" cy="700" r="690" strokeOpacity=".06" />
      <circle cx="700" cy="240" r="4" fill="#D6B571" stroke="none" fillOpacity=".7" />
      <circle cx="1170" cy="700" r="3" fill="#D6B571" stroke="none" fillOpacity=".6" />
      <circle cx="340" cy="960" r="3" fill="#D6B571" stroke="none" fillOpacity=".5" />
    </svg>
  );
}
