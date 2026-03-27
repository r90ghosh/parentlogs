'use client'

export function WarmBackground() {
  return (
    <>
      {/* Warm radial gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(196,112,63,0.07) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 30% at 90% 60%, rgba(212,168,83,0.04) 0%, transparent 60%)',
          ].join(', '),
        }}
      />
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </>
  )
}
