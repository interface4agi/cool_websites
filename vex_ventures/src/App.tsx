import { useState, useEffect } from 'react'
import type { ReactNode, CSSProperties } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

const NBSP = ' '

function FadeIn({
  delay = 0,
  duration = 1000,
  className = '',
  children,
}: {
  delay?: number
  duration?: number
  className?: string
  children: ReactNode
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(id)
  }, [delay])

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

const CHAR_DELAY = 30
const INITIAL_DELAY = 200

function AnimatedHeading({
  text,
  className = '',
  style = {},
}: {
  text: string
  className?: string
  style?: CSSProperties
}) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setStarted(true), INITIAL_DELAY)
    return () => clearTimeout(id)
  }, [])

  const lines = text.split('\n')

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const lineLength = line.length
        return (
          <span key={lineIndex} className="block">
            {line.split('').map((char, charIndex) => {
              const delay =
                lineIndex * lineLength * CHAR_DELAY + charIndex * CHAR_DELAY
              return (
                <span
                  key={charIndex}
                  className="inline-block"
                  style={{
                    opacity: started ? 1 : 0,
                    transform: started ? 'translateX(0)' : 'translateX(-18px)',
                    transition: 'opacity 500ms ease, transform 500ms ease',
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {char === ' ' ? NBSP : char}
                </span>
              )
            })}
          </span>
        )
      })}
    </h1>
  )
}

const NAV_LINKS = ['Story', 'Investing', 'Building', 'Advisory']

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navbar */}
        <div className="px-6 pt-6 md:px-12 lg:px-16">
          <nav className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
            <div className="text-2xl font-semibold tracking-tight">VEX</div>
            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm transition-colors hover:text-gray-300"
                >
                  {link}
                </a>
              ))}
            </div>
            <button className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100">
              Start a Chat
            </button>
          </nav>
        </div>

        {/* Hero content */}
        <div className="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:px-16 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            {/* Left column */}
            <div>
              <AnimatedHeading
                text={'Shaping tomorrow\nwith vision and action.'}
                className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
                style={{ letterSpacing: '-0.04em' }}
              />
              <FadeIn delay={800} duration={1000}>
                <p className="mb-5 text-base text-gray-300 md:text-lg">
                  We back visionaries and craft ventures that define what comes
                  next.
                </p>
              </FadeIn>
              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button className="rounded-lg bg-white px-8 py-3 font-medium text-black">
                    Start a Chat
                  </button>
                  <button className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black">
                    Explore Now
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right column */}
            <div className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
              <FadeIn delay={1400} duration={1000}>
                <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
                  <span className="text-lg font-light md:text-xl lg:text-2xl">
                    Investing. Building. Advisory.
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
