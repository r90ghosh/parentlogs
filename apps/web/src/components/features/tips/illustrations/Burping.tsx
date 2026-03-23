import { C } from './colors'
import type { IllustrationProps } from '@tdc/shared/types/tips'

export function BurpingSection1({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Dad figure — standing, center */}
      <circle cx="200" cy="42" r="16" fill={C.dadHead} />
      <circle cx="196" cy="40" r="1.5" fill="#1e293b" />
      <circle cx="204" cy="40" r="1.5" fill="#1e293b" />
      <rect x="189" y="58" width="22" height="36" rx="6" fill={C.dad} />
      {/* Legs */}
      <rect x="191" y="94" width="8" height="34" rx="3" fill={C.dad} />
      <rect x="203" y="94" width="8" height="34" rx="3" fill={C.dad} />

      {/* Cloth on dad's shoulder */}
      <rect x="210" y="55" width="24" height="10" rx="2" fill={C.object} stroke={C.objectStroke} strokeWidth="1.5" />

      {/* Baby held upright on shoulder — chin on shoulder */}
      <circle cx="225" cy="48" r="8" fill={C.baby} />
      <circle cx="223" cy="47" r="1" fill="#92400e" />
      <circle cx="227" cy="47" r="1" fill="#92400e" />
      <ellipse cx="225" cy="68" rx="6" ry="12" fill={C.baby} />

      {/* Dad arm supporting baby's bottom */}
      <line x1="211" y1="75" x2="225" y2="80" stroke={C.dad} strokeWidth="4" strokeLinecap="round" />
      <circle cx="225" cy="80" r="5" fill={C.dadHead} />

      {/* Dad other arm on baby's back */}
      <line x1="189" y1="72" x2="218" y2="68" stroke={C.dad} strokeWidth="4" strokeLinecap="round" />
      <circle cx="218" cy="68" r="5" fill={C.dadHead} />

      {/* Patting motion lines on back */}
      <line x1="232" y1="62" x2="240" y2="60" stroke={C.action} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="232" y1="68" x2="240" y2="66" stroke={C.action} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="232" y1="74" x2="240" y2="72" stroke={C.action} strokeWidth="1.5" strokeLinecap="round" />

      {/* Bubbles rising — air escaping */}
      <circle cx="235" cy="40" r="3" fill="none" stroke={C.action} strokeWidth="1.5" opacity="0.6" />
      <circle cx="242" cy="30" r="2.5" fill="none" stroke={C.action} strokeWidth="1.5" opacity="0.4" />
      <circle cx="238" cy="20" r="2" fill="none" stroke={C.action} strokeWidth="1.5" opacity="0.2" />
    </svg>
  )
}

export function BurpingSection2({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Dividing line */}
      <line x1="200" y1="20" x2="200" y2="200" stroke={C.surfaceLight} strokeWidth="1.5" />

      {/* LEFT SCENE — Sitting on lap */}
      {/* Chair */}
      <rect x="45" y="115" width="90" height="12" rx="3" fill={C.surface} />
      <rect x="45" y="60" width="12" height="67" rx="3" fill={C.surface} />

      {/* Dad sitting — simplified */}
      <circle cx="90" cy="52" r="14" fill={C.dadHead} />
      <circle cx="86" cy="50" r="1.5" fill="#1e293b" />
      <circle cx="94" cy="50" r="1.5" fill="#1e293b" />
      <rect x="80" y="66" width="20" height="30" rx="5" fill={C.dad} />
      {/* Dad legs on chair */}
      <rect x="80" y="96" width="30" height="10" rx="4" fill={C.dad} />

      {/* Baby sitting on lap facing sideways, leaning forward */}
      <circle cx="115" cy="78" r="7" fill={C.baby} />
      <circle cx="114" cy="77" r="1" fill="#92400e" />
      <ellipse cx="115" cy="94" rx="5" ry="9" fill={C.baby} />

      {/* Dad hand supporting chin/chest */}
      <line x1="80" y1="78" x2="108" y2="82" stroke={C.dad} strokeWidth="3" strokeLinecap="round" />
      <circle cx="108" cy="82" r="4" fill={C.dadHead} />

      {/* Focus ring on supporting hand */}
      <circle cx="108" cy="82" r="12" stroke={C.action} strokeWidth="2" strokeDasharray="4 3" />

      {/* RIGHT SCENE — Face-down across lap */}
      {/* Chair */}
      <rect x="255" y="115" width="90" height="12" rx="3" fill={C.surface} />
      <rect x="255" y="60" width="12" height="67" rx="3" fill={C.surface} />

      {/* Dad sitting */}
      <circle cx="300" cy="52" r="14" fill={C.dadHead} />
      <circle cx="296" cy="50" r="1.5" fill="#1e293b" />
      <circle cx="304" cy="50" r="1.5" fill="#1e293b" />
      <rect x="290" y="66" width="20" height="30" rx="5" fill={C.dad} />
      {/* Dad legs (lap surface) */}
      <rect x="285" y="96" width="40" height="10" rx="4" fill={C.dad} />

      {/* Baby face-down across lap — head slightly higher */}
      <circle cx="280" cy="88" r="6" fill={C.baby} />
      <circle cx="279" cy="87" r="1" fill="#92400e" />
      <ellipse cx="300" cy="92" rx="14" ry="5" fill={C.baby} />

      {/* Dad hand on baby's back */}
      <line x1="310" y1="76" x2="305" y2="88" stroke={C.dad} strokeWidth="3" strokeLinecap="round" />
      <circle cx="305" cy="88" r="4" fill={C.dadHead} />

      {/* Patting motion lines */}
      <line x1="312" y1="82" x2="318" y2="80" stroke={C.action} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="312" y1="88" x2="318" y2="86" stroke={C.action} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="312" y1="94" x2="318" y2="92" stroke={C.action} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
