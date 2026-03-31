'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface WelcomeOverlayProps {
  onDismiss: () => void
}

const COLORS = ['#c4703f', '#d4a853', '#ede6dc', '#c47a8f', '#6b8f71']
const EXPLOSION_COLORS = ['#c4703f', '#d4a853', '#ede6dc']

const BALLOON_CONFIG = [
  { className: 'balloon-1', position: 'left: 5%', size: 'width: 70px; height: 85px', gradient: 'radial-gradient(ellipse at 40% 35%, #d4884f, #c4703f)', tipColor: '#c4703f', rot: '10deg', duration: '8s', delay: '0.3s' },
  { className: 'balloon-2', position: 'left: 15%', size: 'width: 60px; height: 72px', gradient: 'radial-gradient(ellipse at 40% 35%, #e0b86a, #d4a853)', tipColor: '#d4a853', rot: '-6deg', duration: '9s', delay: '0.8s' },
  { className: 'balloon-3', position: 'right: 8%', size: 'width: 80px; height: 96px', gradient: 'radial-gradient(ellipse at 40% 35%, #d4884f, #b8623a)', tipColor: '#b8623a', rot: '12deg', duration: '7.5s', delay: '0.1s' },
  { className: 'balloon-4', position: 'right: 20%', size: 'width: 65px; height: 78px', gradient: 'radial-gradient(ellipse at 40% 35%, #deb567, #c99a45)', tipColor: '#c99a45', rot: '-9deg', duration: '8.5s', delay: '1.2s' },
  { className: 'balloon-5', position: 'left: 35%', size: 'width: 75px; height: 90px', gradient: 'radial-gradient(ellipse at 40% 35%, #d4884f, #c4703f)', tipColor: '#c4703f', rot: '7deg', duration: '9.5s', delay: '0.5s' },
  { className: 'balloon-6', position: 'right: 35%', size: 'width: 68px; height: 82px', gradient: 'radial-gradient(ellipse at 40% 35%, #e0b86a, #d4a853)', tipColor: '#d4a853', rot: '-11deg', duration: '8.2s', delay: '1.5s' },
  { className: 'balloon-7', position: 'left: 50%', size: 'width: 72px; height: 86px', gradient: 'radial-gradient(ellipse at 40% 35%, #cf7b48, #a85c33)', tipColor: '#a85c33', rot: '5deg', duration: '10s', delay: '2s' },
  { className: 'balloon-8', position: 'left: 75%', size: 'width: 62px; height: 74px', gradient: 'radial-gradient(ellipse at 40% 35%, #deb567, #d4a853)', tipColor: '#d4a853', rot: '-8deg', duration: '7.8s', delay: '0.7s' },
]

const EMOJI_LIST = [
  { emoji: '\u{1F476}', position: 'left: 8%', rot: '20deg', duration: '7s', delay: '0.4s' },
  { emoji: '\u{1F37C}', position: 'left: 18%', rot: '-15deg', duration: '8s', delay: '1.0s' },
  { emoji: '\u{2B50}', position: 'left: 30%', rot: '25deg', duration: '6.5s', delay: '0.2s' },
  { emoji: '\u{1F49B}', position: 'left: 42%', rot: '-10deg', duration: '9s', delay: '1.5s' },
  { emoji: '\u{1F389}', position: 'left: 55%', rot: '18deg', duration: '7.5s', delay: '0.7s' },
  { emoji: '\u{1F476}', position: 'left: 65%', rot: '-22deg', duration: '8.5s', delay: '1.2s' },
  { emoji: '\u{2B50}', position: 'left: 78%', rot: '12deg', duration: '6.8s', delay: '0.9s' },
  { emoji: '\u{1F37C}', position: 'left: 88%', rot: '-18deg', duration: '7.2s', delay: '1.8s' },
  { emoji: '\u{1F389}', position: 'left: 25%', rot: '30deg', duration: '8.8s', delay: '2.2s' },
  { emoji: '\u{1F49B}', position: 'left: 70%', rot: '-25deg', duration: '7.8s', delay: '2.5s' },
]

export function WelcomeOverlay({ onDismiss }: WelcomeOverlayProps) {
  const explosionCanvasRef = useRef<HTMLCanvasElement>(null)
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const [fadingOut, setFadingOut] = useState(false)
  const [headlineEnter, setHeadlineEnter] = useState(false)
  const [bodyEnter, setBodyEnter] = useState(false)
  const [ctaEnter, setCtaEnter] = useState(false)
  const [unmounted, setUnmounted] = useState(false)
  const dismissedRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const rafsRef = useRef<number[]>([])
  const prefersReducedMotion = useRef(false)

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setFadingOut(true)
    addTimer(() => {
      setUnmounted(true)
      onDismiss()
    }, 450)
  }, [onDismiss, addTimer])

  // Reduced motion check
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Content animation sequence
  useEffect(() => {
    addTimer(() => setHeadlineEnter(true), 200)
    addTimer(() => setBodyEnter(true), 600)
    addTimer(() => setCtaEnter(true), 1200)
    addTimer(() => dismiss(), 10000)
  }, [addTimer, dismiss])

  // Canvas particle animations
  useEffect(() => {
    if (prefersReducedMotion.current) return

    const explosionCanvas = explosionCanvasRef.current
    const confettiCanvas = confettiCanvasRef.current
    if (!explosionCanvas || !confettiCanvas) return

    const explosionCtx = explosionCanvas.getContext('2d')
    const confettiCtx = confettiCanvas.getContext('2d')
    if (!explosionCtx || !confettiCtx) return

    let W = window.innerWidth
    let H = window.innerHeight
    explosionCanvas.width = confettiCanvas.width = W
    explosionCanvas.height = confettiCanvas.height = H

    const handleResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      explosionCanvas.width = confettiCanvas.width = W
      explosionCanvas.height = confettiCanvas.height = H
    }
    window.addEventListener('resize', handleResize)

    const isMobile = W < 600

    // --- Explosion particles ---
    const EXPLOSION_COUNT = isMobile ? 120 : 200
    interface ExplosionParticle {
      x: number; y: number; vx: number; vy: number
      color: string; radius: number; life: number; decay: number; gravity: number
    }

    const explosionParticles: ExplosionParticle[] = []
    for (let i = 0; i < EXPLOSION_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 6
      explosionParticles.push({
        x: W / 2, y: H / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
        radius: 2 + Math.random() * 3,
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
        gravity: 0.03,
      })
    }

    let explosionRunning = true

    function animateExplosion() {
      if (!explosionRunning) return
      explosionCtx!.clearRect(0, 0, W, H)

      let alive = 0
      for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const p = explosionParticles[i]
        p.vy += p.gravity
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99
        p.life -= p.decay

        if (p.life > 0) {
          explosionCtx!.save()
          explosionCtx!.globalAlpha = p.life
          explosionCtx!.fillStyle = p.color
          explosionCtx!.beginPath()
          explosionCtx!.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2)
          explosionCtx!.fill()
          explosionCtx!.restore()
          alive++
        }
      }

      if (alive === 0) {
        explosionRunning = false
        explosionCtx!.clearRect(0, 0, W, H)
        return
      }

      const raf = requestAnimationFrame(animateExplosion)
      rafsRef.current.push(raf)
    }

    const explosionRaf = requestAnimationFrame(animateExplosion)
    rafsRef.current.push(explosionRaf)

    // --- Confetti particles ---
    const CONFETTI_COUNT = isMobile ? 150 : 250
    interface ConfettiParticle {
      x: number; y: number; color: string; rotation: number; rotationSpeed: number
      shape: number; w: number; h: number; vy: number; vx: number
      wobbleSpeed: number; wobbleAmp: number; wobbleOffset: number; opacity: number
    }

    function createConfetti(randomY: boolean): ConfettiParticle {
      const shape = Math.random() < 0.5 ? 0 : 1
      const w = 3 + Math.random() * 5
      return {
        x: Math.random() * W,
        y: randomY ? -20 + Math.random() * H : -(Math.random() * 100 + 20),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        shape,
        w,
        h: shape === 0 ? w * (0.4 + Math.random() * 0.4) : w,
        vy: 0.4 + Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.5,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleAmp: 0.5 + Math.random() * 1,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: 0.5 + Math.random() * 0.5,
      }
    }

    const confettiParticles: ConfettiParticle[] = []
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      confettiParticles.push(createConfetti(true))
    }

    let confettiRunning = true
    const confettiStart = performance.now()

    function animateConfetti(now: number) {
      if (!confettiRunning) return
      confettiCtx!.clearRect(0, 0, W, H)

      const elapsed = now - confettiStart

      for (const p of confettiParticles) {
        p.y += p.vy
        p.x += p.vx + Math.sin(elapsed * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp * 0.3
        p.rotation += p.rotationSpeed

        if (p.y > H + 30) {
          Object.assign(p, createConfetti(false))
        }

        confettiCtx!.save()
        confettiCtx!.translate(p.x, p.y)
        confettiCtx!.rotate(p.rotation)
        confettiCtx!.globalAlpha = p.opacity
        confettiCtx!.fillStyle = p.color

        if (p.shape === 0) {
          confettiCtx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        } else {
          confettiCtx!.beginPath()
          confettiCtx!.arc(0, 0, p.w / 2, 0, Math.PI * 2)
          confettiCtx!.fill()
        }

        confettiCtx!.restore()
      }

      const raf = requestAnimationFrame(animateConfetti)
      rafsRef.current.push(raf)
    }

    const confettiRaf = requestAnimationFrame(animateConfetti)
    rafsRef.current.push(confettiRaf)

    return () => {
      explosionRunning = false
      confettiRunning = false
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Cleanup all timers and rafs on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
      rafsRef.current.forEach(cancelAnimationFrame)
    }
  }, [])

  if (unmounted) return null

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      <style>{`
        @keyframes welcomeBalloonRise {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          5% { opacity: 0.85; }
          50% { opacity: 0.85; }
          100% { transform: translateY(calc(-100vh - 200px)) rotate(var(--balloon-rot, 8deg)); opacity: 0; }
        }
        @keyframes welcomeEmojiFloat {
          0% { transform: translateY(0) rotate(0deg) scale(0.8); opacity: 0; }
          8% { opacity: 0.9; transform: translateY(-10vh) rotate(5deg) scale(1); }
          50% { opacity: 0.8; }
          100% { transform: translateY(calc(-110vh)) rotate(var(--emoji-rot, 15deg)) scale(0.6); opacity: 0; }
        }
        @keyframes welcomeHeadlineEnter {
          from { opacity: 0; transform: perspective(600px) rotateX(10deg) scale(0.5); }
          to { opacity: 1; transform: perspective(600px) rotateX(0deg) scale(1); }
        }
        @keyframes welcomeFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50"
        style={{
          transition: 'opacity 400ms ease-out',
          opacity: fadingOut ? 0 : 1,
          pointerEvents: fadingOut ? 'none' : 'auto',
        }}
      >
        {/* Warm radial background */}
        <div
          className="fixed inset-0"
          style={{
            zIndex: 0,
            background: `
              radial-gradient(ellipse 60% 50% at 30% 20%, rgba(196,112,63,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 70% 70%, rgba(212,168,83,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 80% 60% at 50% 50%, rgba(196,112,63,0.04) 0%, transparent 80%),
              #12100e
            `,
          }}
        />

        {/* Explosion canvas */}
        {!isReducedMotion && (
          <canvas
            ref={explosionCanvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
          />
        )}

        {/* Confetti canvas */}
        {!isReducedMotion && (
          <canvas
            ref={confettiCanvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 2 }}
          />
        )}

        {/* CSS Balloons */}
        {!isReducedMotion && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
            {BALLOON_CONFIG.map((b, i) => (
              <div
                key={i}
                className={`absolute bottom-[-120px] ${i >= 6 ? 'hidden sm:block' : ''}`}
                style={{
                  ...parseCssPosition(b.position),
                  ...parseCssSize(b.size),
                  background: b.gradient,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  opacity: 0,
                  animation: `welcomeBalloonRise ${b.duration} linear ${b.delay} forwards`,
                  ['--balloon-rot' as string]: b.rot,
                }}
              >
                {/* Shine highlight */}
                <div
                  className="absolute rounded-full"
                  style={{
                    top: '15%', left: '25%', width: '30%', height: '30%',
                    background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
                  }}
                />
                {/* Knot */}
                <div
                  className="absolute"
                  style={{
                    bottom: '-8px', left: '50%', transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `10px solid ${b.tipColor}`,
                  }}
                />
                {/* String */}
                <div
                  className="absolute"
                  style={{
                    bottom: '-60px', left: '50%', width: '1px', height: '50px',
                    background: 'rgba(237,230,220,0.15)',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Floating emoji */}
        {!isReducedMotion && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
            {EMOJI_LIST.map((e, i) => (
              <div
                key={i}
                className={`absolute bottom-[-60px] text-[32px] sm:text-[32px] text-[26px] ${i >= 8 ? 'hidden sm:block' : ''}`}
                style={{
                  ...parseCssPosition(e.position),
                  opacity: 0,
                  animation: `welcomeEmojiFloat ${e.duration} linear ${e.delay} forwards`,
                  ['--emoji-rot' as string]: e.rot,
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                }}
              >
                {e.emoji}
              </div>
            ))}
          </div>
        )}

        {/* Content overlay */}
        <div
          className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
          style={{ zIndex: 10 }}
        >
          {/* Headline */}
          <h1
            className="font-display font-black leading-[1.1] mb-6 text-[44px] min-[401px]:text-[56px] min-[601px]:text-[72px]"
            style={{
              background: 'linear-gradient(135deg, #c4703f, #d4a853)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: headlineEnter ? undefined : 0,
              transform: headlineEnter ? undefined : 'perspective(600px) rotateX(10deg) scale(0.5)',
              transformOrigin: 'center bottom',
              animation: headlineEnter ? 'welcomeHeadlineEnter 800ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined,
            }}
          >
            Welcome to<br />Fatherhood
          </h1>

          {/* Body text */}
          <p
            className="font-body text-[15px] min-[401px]:text-base min-[601px]:text-lg text-[#ede6dc] leading-[1.7] max-w-[500px] mb-10 px-2 sm:px-0"
            style={{
              opacity: bodyEnter ? undefined : 0,
              animation: bodyEnter ? 'welcomeFadeIn 500ms ease-out forwards' : undefined,
            }}
          >
            The greatest adventure of your life just started. We&apos;re here for every step,
            every sleepless night, and every first smile.
          </p>

          {/* CTA Button */}
          <button
            onClick={dismiss}
            className="font-ui text-[15px] min-[401px]:text-base font-semibold uppercase tracking-[0.12em] text-[#faf6f0] border-none rounded-xl cursor-pointer px-9 min-[401px]:px-12 py-3.5 min-[401px]:py-4 hover:bg-[#d47d4a] active:scale-[0.97]"
            style={{
              background: '#c4703f',
              boxShadow: '0 0 30px rgba(196,112,63,0.3)',
              transition: 'background 200ms ease, transform 100ms ease, box-shadow 200ms ease',
              opacity: ctaEnter ? undefined : 0,
              animation: ctaEnter ? 'welcomeFadeIn 500ms ease-out forwards' : undefined,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(196,112,63,0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(196,112,63,0.3)'
            }}
          >
            Let&apos;s Go
          </button>
        </div>
      </div>
    </>
  )
}

/** Parse a CSS position string like "left: 5%" into a style object */
function parseCssPosition(pos: string): React.CSSProperties {
  const [prop, value] = pos.split(':').map(s => s.trim())
  return { [prop]: value }
}

/** Parse a CSS size string like "width: 70px; height: 85px" into a style object */
function parseCssSize(size: string): React.CSSProperties {
  const result: Record<string, string> = {}
  for (const part of size.split(';')) {
    const [prop, value] = part.split(':').map(s => s.trim())
    if (prop && value) result[prop] = value
  }
  return result
}
