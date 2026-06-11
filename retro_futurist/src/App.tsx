import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

const SENSITIVITY = 0.8

const NAV_LINKS = ['Labs', 'Studio', 'Openings', 'Shop']

const PILL_LABELS = [
  'Pitch us an idea',
  'Come work here',
  'Send a brief hello',
  'See how we operate',
]

const TYPEWRITER_TEXT =
  'Glad you stopped in. Good taste tends to find us. Now, what are we building?'

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let index = 0
    let intervalId: ReturnType<typeof setInterval> | undefined

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          if (intervalId) clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const seekingRef = useRef(false)

  const [menuOpen, setMenuOpen] = useState(false)
  const [pillsVisible, setPillsVisible] = useState(false)

  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT)

  // Reveal pills 400ms after load, independent of typewriter.
  useEffect(() => {
    const id = setTimeout(() => setPillsVisible(true), 400)
    return () => clearTimeout(id)
  }, [])

  // Mouse-scrub video control.
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const video = videoRef.current
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        prevXRef.current = e.clientX
        return
      }

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX
        return
      }

      const delta = e.clientX - prevXRef.current
      prevXRef.current = e.clientX

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      let target = targetTimeRef.current + offset
      target = Math.max(0, Math.min(video.duration, target))
      targetTimeRef.current = target

      if (!seekingRef.current) {
        seekingRef.current = true
        video.currentTime = target
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  const handleSeeked = () => {
    const video = videoRef.current
    if (!video) return
    // Queue the next seek if target has moved, preventing seek-flooding.
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      video.currentTime = targetTimeRef.current
    } else {
      seekingRef.current = false
    }
  }

  const copyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('hello@mainframe.co').catch(() => {})
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: '70% center' }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 z-10 flex w-full items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] tracking-tight text-black sm:text-[26px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe(R)
          </span>
          <span
            className="select-none text-[25px] text-black sm:text-[30px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden text-[23px] text-black md:flex">
          {NAV_LINKS.map((link, i) => (
            <span key={link}>
              <a href="#" className="transition-opacity hover:opacity-60">
                {link}
              </a>
              {i < NAV_LINKS.length - 1 && <span>, </span>}
            </span>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
        >
          Get in touch
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex flex-col gap-[5px] md:hidden"
        >
          <span
            className="h-[2px] w-6 bg-black transition-all duration-300"
            style={
              menuOpen
                ? { transform: 'translateY(7px) rotate(45deg)' }
                : undefined
            }
          />
          <span
            className="h-[2px] w-6 bg-black transition-all duration-300"
            style={menuOpen ? { opacity: 0 } : undefined}
          />
          <span
            className="h-[2px] w-6 bg-black transition-all duration-300"
            style={
              menuOpen
                ? { transform: 'translateY(-7px) rotate(-45deg)' }
                : undefined
            }
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            onClick={() => setMenuOpen(false)}
            className="text-[32px] font-medium text-black"
          >
            {link}
          </a>
        ))}
        <a
          href="#"
          onClick={() => setMenuOpen(false)}
          className="text-[32px] font-medium text-black underline"
        >
          Get in touch
        </a>
      </div>

      {/* Hero */}
      <section className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          {/* Blurred intro label */}
          <div
            className="pointer-events-none mb-5 select-none sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#000',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* Typewriter */}
          <p
            className="mb-5 text-black sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: '54px',
            }}
          >
            {displayed}
            {!done && (
              <span className="aria-cursor ml-[2px] inline-block h-[1.1em] w-[2px] bg-black align-middle" />
            )}
          </p>

          {/* Action pills */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {PILL_LABELS.map((label) => (
              <button
                key={label}
                type="button"
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
              >
                {label}
              </button>
            ))}

            {/* Outline email pill */}
            <button
              type="button"
              onClick={copyEmail}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">
                  hello@mainframe.co
                </span>
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                aria-hidden="true"
              >
                <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
                <rect x="1.5" y="1.5" width="6" height="6" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
