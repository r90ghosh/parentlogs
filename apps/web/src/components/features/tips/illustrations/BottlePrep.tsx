import { C } from './colors'
import type { IllustrationProps } from '@tdc/shared/types/tips'

export function BottlePrepSection1({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* LEFT AREA — Disassembled bottle + kettle */}

      {/* Kettle */}
      <path d="M50 140 L50 110 Q50 95 65 95 L105 95 Q120 95 120 110 L120 140 Z" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Kettle handle */}
      <path d="M120 105 Q140 105 140 120 Q140 135 120 135" stroke={C.objectStroke} strokeWidth="2" fill="none" />
      {/* Kettle spout */}
      <line x1="50" y1="108" x2="38" y2="100" stroke={C.objectStroke} strokeWidth="2" strokeLinecap="round" />
      {/* Steam wisps */}
      <path d="M65 88 Q68 78 65 68" stroke={C.object} strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
      <path d="M85 85 Q88 72 85 62" stroke={C.object} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M105 88 Q108 78 105 68" stroke={C.object} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />

      {/* Bottle body — disassembled parts nearby */}
      <rect x="160" y="70" width="24" height="70" rx="6" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Measurement lines on bottle */}
      <line x1="164" y1="90" x2="174" y2="90" stroke={C.objectStroke} strokeWidth="1.5" />
      <line x1="164" y1="105" x2="174" y2="105" stroke={C.objectStroke} strokeWidth="1.5" />
      <line x1="164" y1="120" x2="174" y2="120" stroke={C.objectStroke} strokeWidth="1.5" />
      {/* Nipple — dome shape above */}
      <path d="M166 55 Q172 40 178 55" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />
      {/* Ring */}
      <rect x="163" y="55" width="18" height="8" rx="3" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />

      {/* RIGHT AREA — Scoop and leveling */}
      {/* Bottle opening receiving scoop */}
      <rect x="280" y="80" width="24" height="60" rx="6" fill={C.object} stroke={C.objectStroke} strokeWidth="2" />

      {/* Scoop — U shape */}
      <path d="M270 55 L270 40 Q280 28 290 40 L290 55" stroke={C.object} strokeWidth="2" fill={C.object} fillOpacity="0.4" />
      {/* Powder mound in scoop */}
      <path d="M272 42 Q280 34 288 42" fill={C.object} />
      {/* Leveling line across scoop top */}
      <line x1="264" y1="55" x2="296" y2="55" stroke={C.warn} strokeWidth="2.5" strokeLinecap="round" />

      {/* Arrow from scoop to bottle */}
      <path d="M280 65 L288 75" stroke={C.action} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M288 75 L282 70 L292 70 Z" fill={C.action} />
    </svg>
  )
}

export function BottlePrepSection2({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* LEFT SIDE — Temperature test on wrist */}
      {/* Wrist / arm */}
      <rect x="50" y="90" width="60" height="18" rx="9" fill={C.dadHead} />
      {/* Inner wrist circle */}
      <circle cx="90" cy="99" r="10" stroke={C.action} strokeWidth="2" strokeDasharray="4 3" />
      {/* Droplet landing on wrist */}
      <path d="M90 78 Q92 72 90 65 Q88 72 90 78 Z" fill={C.action} />
      {/* Small drop trail */}
      <circle cx="90" cy="58" r="2" fill={C.action} opacity="0.5" />

      {/* Bottle above wrist (tilted) */}
      <g transform="rotate(-30 80 45)">
        <rect x="68" y="20" width="16" height="40" rx="4" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
        <path d="M71 20 Q76 12 81 20" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
      </g>

      {/* RIGHT SIDE — Dad holding baby at 45° with bottle */}
      {/* Dad figure */}
      <circle cx="280" cy="55" r="16" fill={C.dadHead} />
      <circle cx="276" cy="53" r="1.5" fill="#1e293b" />
      <circle cx="284" cy="53" r="1.5" fill="#1e293b" />
      <rect x="269" y="71" width="22" height="36" rx="6" fill={C.dad} />
      <rect x="271" y="107" width="8" height="30" rx="3" fill={C.dad} />
      <rect x="283" y="107" width="8" height="30" rx="3" fill={C.dad} />

      {/* Baby reclined at ~45° in dad's arms */}
      <g transform="rotate(-35 260 110)">
        <circle cx="240" cy="100" r="8" fill={C.baby} />
        <circle cx="238" cy="99" r="1" fill="#92400e" />
        <circle cx="242" cy="99" r="1" fill="#92400e" />
        <ellipse cx="240" cy="116" rx="6" ry="11" fill={C.baby} />
      </g>

      {/* Dad arm cradling baby */}
      <line x1="269" y1="82" x2="240" y2="105" stroke={C.dad} strokeWidth="4" strokeLinecap="round" />
      <circle cx="240" cy="105" r="5" fill={C.dadHead} />

      {/* Other arm holding bottle toward baby's mouth */}
      <line x1="291" y1="82" x2="255" y2="88" stroke={C.dad} strokeWidth="4" strokeLinecap="round" />
      <circle cx="255" cy="88" r="5" fill={C.dadHead} />

      {/* Bottle tilted toward baby */}
      <g transform="rotate(-50 250 80)">
        <rect x="242" y="65" width="12" height="30" rx="4" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
        <path d="M244 65 Q248 58 252 65" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />
      </g>
    </svg>
  )
}
