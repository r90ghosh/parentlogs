interface IllustrationProps {
  className?: string
}

export function BottlePrepPlaceholder({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Baby bottle — centered */}
      <rect x="130" y="40" width="60" height="130" rx="10" fill="#201c18" stroke="#4a4239" strokeWidth="2" />
      {/* Nipple */}
      <path d="M145 40 Q160 15 175 40" fill="#ede6dc" stroke="#1a1714" strokeWidth="1.5" />
      {/* Measurement lines */}
      <line x1="135" y1="80" x2="155" y2="80" stroke="#7a6f62" strokeWidth="1" />
      <line x1="135" y1="100" x2="150" y2="100" stroke="#7a6f62" strokeWidth="1" />
      <line x1="135" y1="120" x2="155" y2="120" stroke="#7a6f62" strokeWidth="1" />
      <line x1="135" y1="140" x2="150" y2="140" stroke="#7a6f62" strokeWidth="1" />
      {/* Milk fill */}
      <rect x="132" y="90" width="56" height="78" rx="8" fill="#ede6dc" opacity="0.15" />
      {/* Temperature icon */}
      <rect x="220" y="80" width="10" height="50" rx="5" fill="#201c18" stroke="#c4703f" strokeWidth="1.5" />
      <circle cx="225" cy="135" r="8" fill="#c4703f" opacity="0.3" />
      <circle cx="225" cy="135" r="5" fill="#c4703f" opacity="0.5" />
      <rect x="222" y="95" width="6" height="35" rx="3" fill="#c4703f" opacity="0.4" />
      {/* Steam lines */}
      <path d="M145 30 Q148 20 145 10" stroke="#d4a853" strokeWidth="1" opacity="0.4" />
      <path d="M160 28 Q163 18 160 8" stroke="#d4a853" strokeWidth="1" opacity="0.4" />
      <path d="M175 30 Q178 20 175 10" stroke="#d4a853" strokeWidth="1" opacity="0.4" />
      {/* Label */}
      <text x="110" y="210" fontFamily="sans-serif" fontSize="12" fill="#7a6f62" textAnchor="middle" />
    </svg>
  )
}

export function SwaddlingPlaceholder({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Diamond blanket */}
      <path d="M160 30 L270 120 L160 210 L50 120 Z" fill="#201c18" stroke="#4a4239" strokeWidth="2" />
      {/* Folded top */}
      <path d="M110 80 L160 55 L210 80" fill="#201c18" stroke="#c4703f" strokeWidth="1.5" strokeDasharray="5 3" />
      {/* Baby in swaddle */}
      <ellipse cx="160" cy="130" rx="30" ry="50" fill="#ede6dc" opacity="0.15" />
      <circle cx="160" cy="85" r="16" fill="#ede6dc" opacity="0.7" />
      <circle cx="155" cy="83" r="2" fill="#1a1714" />
      <circle cx="165" cy="83" r="2" fill="#1a1714" />
      <path d="M156 90 Q160 94 164 90" stroke="#1a1714" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Wrap arrows */}
      <path d="M90 120 Q120 100 140 120" stroke="#c4703f" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M134 114 L142 120 L136 128" stroke="#c4703f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M230 120 Q200 100 180 120" stroke="#d4a853" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M186 114 L178 120 L184 128" stroke="#d4a853" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BathTimePlaceholder({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Tub */}
      <path d="M60 120 L60 180 Q60 200 80 200 L240 200 Q260 200 260 180 L260 120 Z" fill="#201c18" stroke="#4a4239" strokeWidth="2" />
      {/* Water */}
      <path d="M65 140 Q100 135 160 140 Q220 145 255 140 L255 180 Q255 195 240 195 L80 195 Q65 195 65 180 Z" fill="#5b9bd5" opacity="0.1" />
      {/* Water ripples */}
      <path d="M80 150 Q120 142 160 150 Q200 158 240 150" stroke="#5b9bd5" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M90 160 Q130 153 160 160 Q190 167 230 160" stroke="#5b9bd5" strokeWidth="1" fill="none" opacity="0.2" />
      {/* Baby in tub */}
      <circle cx="160" cy="130" r="14" fill="#ede6dc" opacity="0.7" />
      <circle cx="155" cy="128" r="2" fill="#1a1714" />
      <circle cx="165" cy="128" r="2" fill="#1a1714" />
      <path d="M156 135 Q160 138 164 135" stroke="#1a1714" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Temperature indicator */}
      <circle cx="250" cy="85" r="18" fill="none" stroke="#c4703f" strokeWidth="1.5" />
      <text x="243" y="90" fontFamily="sans-serif" fontSize="11" fill="#c4703f">37°</text>
      {/* Bubbles */}
      <circle cx="100" cy="135" r="4" fill="#ede6dc" opacity="0.15" />
      <circle cx="115" cy="128" r="3" fill="#ede6dc" opacity="0.1" />
      <circle cx="210" cy="132" r="5" fill="#ede6dc" opacity="0.12" />
    </svg>
  )
}

export function CarSeatPlaceholder({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Car seat silhouette — side view */}
      <path d="M100 200 L100 100 Q100 60 130 50 L170 50 Q200 60 200 100 L200 200 Z" fill="#201c18" stroke="#4a4239" strokeWidth="2" />
      {/* Seat padding */}
      <path d="M115 190 L115 110 Q115 80 140 70 L160 70 Q185 80 185 110 L185 190 Z" fill="#4a4239" />
      {/* Harness straps */}
      <line x1="130" y1="90" x2="140" y2="150" stroke="#c4703f" strokeWidth="2" />
      <line x1="170" y1="90" x2="160" y2="150" stroke="#c4703f" strokeWidth="2" />
      {/* Chest clip */}
      <rect x="142" y="120" width="16" height="6" rx="3" fill="#c4703f" />
      {/* Buckle */}
      <circle cx="150" cy="155" r="6" fill="#d4a853" opacity="0.5" stroke="#d4a853" strokeWidth="1" />
      {/* Rear-facing arrow */}
      <path d="M240 150 L240 90" stroke="#c4703f" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M234 100 L240 88 L246 100" stroke="#c4703f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="223" y="170" fontFamily="sans-serif" fontSize="9" fill="#7a6f62">rear-</text>
      <text x="221" y="182" fontFamily="sans-serif" fontSize="9" fill="#7a6f62">facing</text>
      {/* Base */}
      <rect x="90" y="200" width="120" height="12" rx="4" fill="#4a4239" stroke="#1a1714" strokeWidth="1.5" />
    </svg>
  )
}

export function BurpingPlaceholder({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className}>
      {/* Dad — over-shoulder position */}
      <circle cx="140" cy="55" r="24" fill="#ede6dc" />
      <circle cx="133" cy="51" r="2.5" fill="#1a1714" />
      <circle cx="147" cy="51" r="2.5" fill="#1a1714" />
      <path d="M135 62 Q140 68 145 62" stroke="#1a1714" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="122" y="79" width="36" height="55" rx="14" fill="#4a4239" />
      {/* Shoulder */}
      <path d="M122 85 Q100 85 90 95" stroke="#4a4239" strokeWidth="10" strokeLinecap="round" />
      <path d="M158 85 Q180 85 190 95" stroke="#4a4239" strokeWidth="10" strokeLinecap="round" />
      {/* Baby on shoulder */}
      <circle cx="170" cy="78" r="10" fill="#ede6dc" opacity="0.8" />
      <circle cx="173" cy="76" r="1.5" fill="#1a1714" />
      <ellipse cx="175" cy="92" rx="10" ry="16" fill="#ede6dc" opacity="0.5" />
      {/* Patting hand — copper */}
      <ellipse cx="178" cy="100" rx="10" ry="6" fill="#c4703f" opacity="0.25" />
      <path d="M170 100 Q178 94 186 100" stroke="#ede6dc" strokeWidth="3" strokeLinecap="round" />
      {/* Pat motion lines */}
      <path d="M192 92 L198 86" stroke="#c4703f" strokeWidth="1.5" opacity="0.5" />
      <path d="M194 100 L202 96" stroke="#c4703f" strokeWidth="1.5" opacity="0.4" />
      <path d="M192 108 L198 112" stroke="#c4703f" strokeWidth="1.5" opacity="0.3" />
      {/* Burp cloth on shoulder */}
      <rect x="155" y="82" width="20" height="6" rx="2" fill="#ede6dc" opacity="0.3" />
      {/* Air bubbles */}
      <circle cx="185" cy="65" r="3" fill="none" stroke="#d4a853" strokeWidth="1" opacity="0.4" />
      <circle cx="195" cy="55" r="4" fill="none" stroke="#d4a853" strokeWidth="1" opacity="0.3" />
      <circle cx="190" cy="42" r="5" fill="none" stroke="#d4a853" strokeWidth="1" opacity="0.2" />
    </svg>
  )
}
