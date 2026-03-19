interface IllustrationProps {
  className?: string
}

/* ---------------------------------------------------------------
   Shared palette constants
   - copper  #c4703f  — action highlights
   - gold    #d4a853  — accents, small highlights
   - dark    #1a1714  — structure, outlines
   - dim     #4a4239  — background / dad body
   - cream   #ede6dc  — light skin, light elements
   - surface #201c18  — pad / surface fills
--------------------------------------------------------------- */

export function BabyChangingStep1({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Changing surface — top-down */}
      <rect x="60" y="40" width="200" height="160" rx="12" fill="#201c18" stroke="#4a4239" strokeWidth="1.5" />
      {/* Diaper */}
      <rect x="80" y="60" width="60" height="40" rx="4" fill="#ede6dc" stroke="#1a1714" strokeWidth="1.5" />
      <rect x="80" y="60" width="12" height="12" rx="2" fill="#d4a853" />
      <rect x="128" y="60" width="12" height="12" rx="2" fill="#d4a853" />
      {/* Wipes box */}
      <rect x="170" y="60" width="50" height="35" rx="6" fill="#4a4239" stroke="#1a1714" strokeWidth="1.5" />
      <rect x="185" y="55" width="20" height="10" rx="3" fill="#ede6dc" opacity="0.6" />
      {/* Cream tube */}
      <rect x="80" y="120" width="16" height="50" rx="8" fill="#ede6dc" stroke="#1a1714" strokeWidth="1.5" />
      <rect x="84" y="115" width="8" height="10" rx="2" fill="#c4703f" />
      {/* Spare onesie — folded */}
      <rect x="120" y="120" width="50" height="40" rx="4" fill="#4a4239" stroke="#1a1714" strokeWidth="1.5" />
      <path d="M130 120 L140 110 L150 110 L160 120" stroke="#1a1714" strokeWidth="1.5" fill="none" />
      {/* Checkmark circle — action indicator */}
      <circle cx="240" cy="170" r="18" fill="#c4703f" opacity="0.15" />
      <path d="M230 170 L237 177 L250 163" stroke="#c4703f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BabyChangingStep2({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Dad — side view */}
      <circle cx="120" cy="60" r="22" fill="#ede6dc" />
      <circle cx="113" cy="56" r="2.5" fill="#1a1714" />
      <circle cx="127" cy="56" r="2.5" fill="#1a1714" />
      <path d="M115 66 Q120 72 125 66" stroke="#1a1714" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="105" y="82" width="30" height="50" rx="12" fill="#4a4239" />
      {/* Arms reaching down */}
      <path d="M105 95 Q80 120 90 145" stroke="#4a4239" strokeWidth="8" strokeLinecap="round" />
      <path d="M135 95 Q160 120 150 145" stroke="#4a4239" strokeWidth="8" strokeLinecap="round" />
      {/* Hands — copper highlight */}
      <circle cx="90" cy="148" r="8" fill="#c4703f" opacity="0.25" />
      <circle cx="90" cy="148" r="5" fill="#ede6dc" />
      <circle cx="150" cy="148" r="8" fill="#c4703f" opacity="0.25" />
      <circle cx="150" cy="148" r="5" fill="#ede6dc" />
      {/* Baby */}
      <ellipse cx="120" cy="175" rx="30" ry="16" fill="#ede6dc" opacity="0.8" />
      <circle cx="120" cy="160" r="12" fill="#ede6dc" />
      <circle cx="117" cy="158" r="1.5" fill="#1a1714" />
      <circle cx="123" cy="158" r="1.5" fill="#1a1714" />
      {/* Lift arrow */}
      <path d="M200 180 L200 120" stroke="#c4703f" strokeWidth="2.5" strokeDasharray="6 4" />
      <path d="M192 130 L200 118 L208 130" stroke="#c4703f" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Labels */}
      <text x="195" y="200" fontFamily="sans-serif" fontSize="10" fill="#7a6f62">HEAD</text>
      <text x="75" y="168" fontFamily="sans-serif" fontSize="9" fill="#c4703f">neck</text>
      <text x="152" y="168" fontFamily="sans-serif" fontSize="9" fill="#c4703f">bottom</text>
    </svg>
  )
}

export function BabyChangingStep3({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Changing pad */}
      <rect x="50" y="120" width="220" height="70" rx="10" fill="#201c18" stroke="#4a4239" strokeWidth="1.5" />
      {/* Raised sides */}
      <path d="M50 130 Q50 110 70 110" stroke="#4a4239" strokeWidth="1.5" fill="none" />
      <path d="M270 130 Q270 110 250 110" stroke="#4a4239" strokeWidth="1.5" fill="none" />
      {/* Baby on pad */}
      <ellipse cx="160" cy="145" rx="45" ry="14" fill="#ede6dc" opacity="0.8" />
      <circle cx="160" cy="128" r="14" fill="#ede6dc" />
      <circle cx="155" cy="126" r="2" fill="#1a1714" />
      <circle cx="165" cy="126" r="2" fill="#1a1714" />
      <path d="M156 133 Q160 136 164 133" stroke="#1a1714" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Dad's hand on chest — copper glow */}
      <ellipse cx="160" cy="142" rx="12" ry="6" fill="#c4703f" opacity="0.2" />
      <ellipse cx="160" cy="142" rx="8" ry="4" fill="#ede6dc" opacity="0.7" />
      {/* Dad arm from left */}
      <path d="M30 90 Q80 100 155 138" stroke="#4a4239" strokeWidth="8" strokeLinecap="round" />
      {/* Safety shield icon */}
      <path d="M260 50 L260 75 Q260 90 245 95 Q230 90 230 75 L230 50 Z" fill="#6b8f71" opacity="0.15" stroke="#6b8f71" strokeWidth="1.5" />
      <path d="M240 68 L244 74 L254 62" stroke="#6b8f71" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BabyChangingStep4({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Onesie — close-up view */}
      <path d="M100 50 Q110 35 130 30 L140 30 L160 30 Q180 30 190 35 L220 50 L210 75 L190 65 L190 200 L130 200 L130 65 L110 75 L100 50 Z" fill="#ede6dc" stroke="#1a1714" strokeWidth="1.5" />
      {/* Snap buttons — gold */}
      <circle cx="155" cy="170" r="4" fill="#d4a853" />
      <circle cx="155" cy="185" r="4" fill="#d4a853" />
      <circle cx="165" cy="170" r="4" fill="#d4a853" />
      <circle cx="165" cy="185" r="4" fill="#d4a853" />
      {/* Fold arrow — shows fold-up direction */}
      <path d="M230 190 L230 100" stroke="#c4703f" strokeWidth="2.5" strokeDasharray="6 4" />
      <path d="M222 110 L230 98 L238 110" stroke="#c4703f" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* "fold up" label */}
      <text x="240" y="150" fontFamily="sans-serif" fontSize="10" fill="#c4703f" transform="rotate(-90,240,150)">fold up</text>
      {/* Dotted lines showing snap locations */}
      <line x1="140" y1="165" x2="140" y2="195" stroke="#7a6f62" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="180" y1="165" x2="180" y2="195" stroke="#7a6f62" strokeWidth="1" strokeDasharray="3 3" />
      <text x="144" y="163" fontFamily="sans-serif" fontSize="8" fill="#7a6f62">snaps</text>
    </svg>
  )
}

export function BabyChangingStep5({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Top-down view — changing surface */}
      <rect x="50" y="30" width="220" height="180" rx="12" fill="#201c18" stroke="#4a4239" strokeWidth="1" />
      {/* Baby silhouette — top-down */}
      <ellipse cx="160" cy="110" rx="35" ry="55" fill="#ede6dc" opacity="0.5" />
      <circle cx="160" cy="60" r="18" fill="#ede6dc" opacity="0.7" />
      {/* Clean diaper — partially under baby */}
      <rect x="120" y="120" width="80" height="55" rx="4" fill="#ede6dc" stroke="#1a1714" strokeWidth="1.5" />
      {/* Tabs */}
      <rect x="115" y="130" width="10" height="15" rx="2" fill="#d4a853" />
      <rect x="195" y="130" width="10" height="15" rx="2" fill="#d4a853" />
      {/* Slide arrow */}
      <path d="M160 200 L160 145" stroke="#c4703f" strokeWidth="2.5" strokeDasharray="6 4" />
      <path d="M152 155 L160 143 L168 155" stroke="#c4703f" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Tab labels */}
      <text x="108" y="160" fontFamily="sans-serif" fontSize="8" fill="#d4a853">tab</text>
      <text x="198" y="160" fontFamily="sans-serif" fontSize="8" fill="#d4a853">tab</text>
    </svg>
  )
}

export function BabyChangingStep6({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Changing surface */}
      <rect x="50" y="130" width="220" height="60" rx="8" fill="#201c18" stroke="#4a4239" strokeWidth="1" />
      {/* Baby body */}
      <ellipse cx="160" cy="135" rx="40" ry="14" fill="#ede6dc" opacity="0.7" />
      {/* Baby head */}
      <circle cx="110" cy="130" r="14" fill="#ede6dc" />
      <circle cx="106" cy="128" r="2" fill="#1a1714" />
      <circle cx="114" cy="128" r="2" fill="#1a1714" />
      {/* Baby legs up */}
      <path d="M195 130 Q210 100 200 85" stroke="#ede6dc" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <path d="M190 130 Q180 100 185 85" stroke="#ede6dc" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      {/* Feet */}
      <circle cx="200" cy="82" r="5" fill="#ede6dc" opacity="0.8" />
      <circle cx="185" cy="82" r="5" fill="#ede6dc" opacity="0.8" />
      {/* Dad's hand holding ankles — copper highlight */}
      <ellipse cx="193" cy="90" rx="18" ry="10" fill="#c4703f" opacity="0.2" />
      <path d="M175 90 Q193 80 210 90" stroke="#ede6dc" strokeWidth="4" strokeLinecap="round" />
      {/* Open diaper underneath */}
      <rect x="140" y="140" width="60" height="20" rx="3" fill="#ede6dc" opacity="0.4" stroke="#7a6f62" strokeWidth="1" strokeDasharray="3 3" />
      {/* Lift arrow */}
      <path d="M230 130 L230 80" stroke="#c4703f" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M224 90 L230 78 L236 90" stroke="#c4703f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BabyChangingStep7({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Simplified top-down view */}
      <rect x="60" y="40" width="200" height="160" rx="12" fill="#201c18" stroke="#4a4239" strokeWidth="1" />
      {/* Baby outline — top-down */}
      <ellipse cx="160" cy="120" rx="35" ry="55" fill="#ede6dc" opacity="0.3" />
      <circle cx="160" cy="70" r="16" fill="#ede6dc" opacity="0.5" />
      {/* Large directional arrow — front to back */}
      <path d="M160 90 L160 175" stroke="#c4703f" strokeWidth="4" strokeLinecap="round" />
      <path d="M148 165 L160 180 L172 165" stroke="#c4703f" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* "front" label */}
      <text x="185" y="95" fontFamily="sans-serif" fontSize="10" fill="#7a6f62">front</text>
      {/* "back" label */}
      <text x="185" y="175" fontFamily="sans-serif" fontSize="10" fill="#7a6f62">back</text>
      {/* Wipe in hand indicator */}
      <rect x="145" y="110" width="30" height="18" rx="4" fill="#c4703f" opacity="0.3" />
      <text x="149" y="123" fontFamily="sans-serif" fontSize="8" fill="#c4703f">wipe</text>
    </svg>
  )
}

export function BabyChangingStep8({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Three-step sequence */}
      {/* Step A — open diaper */}
      <rect x="30" y="80" width="60" height="40" rx="4" fill="#ede6dc" opacity="0.5" stroke="#7a6f62" strokeWidth="1.5" />
      <text x="42" y="140" fontFamily="sans-serif" fontSize="9" fill="#7a6f62">open</text>
      {/* Arrow 1 */}
      <path d="M100 100 L130 100" stroke="#c4703f" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M124 94 L133 100 L124 106" stroke="#c4703f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Step B — folded ball */}
      <circle cx="165" cy="100" r="22" fill="#ede6dc" opacity="0.5" stroke="#7a6f62" strokeWidth="1.5" />
      {/* Tab as tape */}
      <rect x="158" y="82" width="14" height="8" rx="2" fill="#d4a853" opacity="0.6" />
      <text x="147" y="140" fontFamily="sans-serif" fontSize="9" fill="#7a6f62">rolled</text>
      {/* Arrow 2 */}
      <path d="M197 100 L227 100" stroke="#c4703f" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M221 94 L230 100 L221 106" stroke="#c4703f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Step C — pail */}
      <rect x="240" y="70" width="50" height="60" rx="6" fill="#4a4239" stroke="#1a1714" strokeWidth="1.5" />
      <rect x="238" y="66" width="54" height="8" rx="4" fill="#4a4239" stroke="#1a1714" strokeWidth="1.5" />
      {/* Lid slightly open */}
      <path d="M238 70 Q265 55 292 70" stroke="#1a1714" strokeWidth="1.5" fill="#4a4239" />
      <text x="249" y="140" fontFamily="sans-serif" fontSize="9" fill="#7a6f62">pail</text>
    </svg>
  )
}

export function BabyChangingStep9({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Baby lower half on surface */}
      <rect x="60" y="140" width="200" height="50" rx="8" fill="#201c18" stroke="#4a4239" strokeWidth="1" />
      <ellipse cx="160" cy="140" rx="40" ry="14" fill="#ede6dc" opacity="0.6" />
      {/* Cloth patting — hand with cloth */}
      <rect x="135" y="100" width="40" height="25" rx="6" fill="#ede6dc" stroke="#1a1714" strokeWidth="1.5" />
      <text x="142" y="117" fontFamily="sans-serif" fontSize="9" fill="#7a6f62">cloth</text>
      {/* Patting motion arrows */}
      <path d="M155 98 L155 88" stroke="#c4703f" strokeWidth="2" />
      <path d="M155 88 L155 98" stroke="#c4703f" strokeWidth="2" />
      <path d="M148 86 L155 80 L162 86" stroke="#c4703f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M140 92 L155 82 L170 92" stroke="#c4703f" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Air-dry wavy lines */}
      <path d="M200 108 Q208 102 216 108 Q224 114 232 108" stroke="#d4a853" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M200 118 Q208 112 216 118 Q224 124 232 118" stroke="#d4a853" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M200 128 Q208 122 216 128 Q224 134 232 128" stroke="#d4a853" strokeWidth="1.5" fill="none" opacity="0.3" />
      <text x="205" y="145" fontFamily="sans-serif" fontSize="8" fill="#d4a853">air dry</text>
    </svg>
  )
}

export function BabyChangingStep10({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Finger with dab */}
      <path d="M80 100 L80 160" stroke="#ede6dc" strokeWidth="10" strokeLinecap="round" />
      <circle cx="80" cy="165" r="8" fill="#d4a853" opacity="0.7" />
      <text x="60" y="90" fontFamily="sans-serif" fontSize="9" fill="#7a6f62">finger</text>
      {/* Arrow from finger to area */}
      <path d="M95 140 L140 140" stroke="#c4703f" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M134 134 L143 140 L134 146" stroke="#c4703f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Application area */}
      <ellipse cx="200" cy="140" rx="60" ry="40" fill="#201c18" stroke="#4a4239" strokeWidth="1.5" />
      {/* Gold dab in center */}
      <circle cx="180" cy="135" r="4" fill="#d4a853" opacity="0.6" />
      {/* Spreading motion arrows */}
      <path d="M185 135 L210 125" stroke="#c4703f" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M185 140 L215 140" stroke="#c4703f" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M185 145 L210 155" stroke="#c4703f" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Arrow tips */}
      <circle cx="212" cy="124" r="2" fill="#c4703f" opacity="0.5" />
      <circle cx="217" cy="140" r="2" fill="#c4703f" opacity="0.5" />
      <circle cx="212" cy="156" r="2" fill="#c4703f" opacity="0.5" />
      <text x="175" y="190" fontFamily="sans-serif" fontSize="9" fill="#7a6f62">thin layer</text>
    </svg>
  )
}

export function BabyChangingStep11({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Front view — diaper on baby */}
      {/* Baby torso outline */}
      <ellipse cx="160" cy="90" rx="50" ry="30" fill="#ede6dc" opacity="0.3" />
      {/* Diaper — front view */}
      <path d="M110 100 L110 170 Q110 190 130 195 L190 195 Q210 190 210 170 L210 100 Z" fill="#ede6dc" stroke="#1a1714" strokeWidth="1.5" />
      {/* Pull-up arrow */}
      <path d="M160 210 L160 170" stroke="#c4703f" strokeWidth="2.5" strokeDasharray="6 4" />
      <path d="M152 180 L160 168 L168 180" stroke="#c4703f" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Tab arrows — fastening */}
      <path d="M95 110 L115 110" stroke="#d4a853" strokeWidth="2" />
      <path d="M109 104 L118 110 L109 116" stroke="#d4a853" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M225 110 L205 110" stroke="#d4a853" strokeWidth="2" />
      <path d="M211 104 L202 110 L211 116" stroke="#d4a853" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Two-finger gap indicator */}
      <line x1="150" y1="95" x2="150" y2="110" stroke="#c4703f" strokeWidth="1.5" />
      <line x1="170" y1="95" x2="170" y2="110" stroke="#c4703f" strokeWidth="1.5" />
      <path d="M150 102 L170 102" stroke="#c4703f" strokeWidth="1" strokeDasharray="3 2" />
      <text x="152" y="90" fontFamily="sans-serif" fontSize="8" fill="#c4703f">2 fingers</text>
      {/* Belly line */}
      <path d="M125 95 Q160 80 195 95" stroke="#ede6dc" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
    </svg>
  )
}

export function BabyChangingStep12({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Happy dad */}
      <circle cx="130" cy="55" r="26" fill="#ede6dc" />
      <circle cx="122" cy="50" r="3" fill="#1a1714" />
      <circle cx="138" cy="50" r="3" fill="#1a1714" />
      <path d="M120 62 Q130 72 140 62" stroke="#1a1714" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="112" y="81" width="36" height="55" rx="14" fill="#4a4239" />
      {/* Arms holding baby */}
      <path d="M112 95 Q90 110 100 130" stroke="#4a4239" strokeWidth="8" strokeLinecap="round" />
      <path d="M148 95 Q170 110 160 130" stroke="#4a4239" strokeWidth="8" strokeLinecap="round" />
      {/* Baby in arms */}
      <ellipse cx="130" cy="140" rx="25" ry="12" fill="#ede6dc" opacity="0.7" />
      <circle cx="130" cy="128" r="11" fill="#ede6dc" />
      <circle cx="127" cy="126" r="1.5" fill="#1a1714" />
      <circle cx="133" cy="126" r="1.5" fill="#1a1714" />
      <path d="M127 132 Q130 135 133 132" stroke="#1a1714" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Large checkmark — sage */}
      <circle cx="230" cy="100" r="36" fill="#6b8f71" opacity="0.15" />
      <path d="M210 100 L224 114 L252 84" stroke="#6b8f71" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Hand-wash icon — bottom right */}
      <circle cx="250" cy="190" r="20" fill="#201c18" stroke="#4a4239" strokeWidth="1.5" />
      {/* Water drop */}
      <path d="M250 178 Q255 185 250 192 Q245 185 250 178 Z" fill="#5b9bd5" opacity="0.6" />
      {/* Hands */}
      <path d="M240 192 Q250 200 260 192" stroke="#ede6dc" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  )
}
