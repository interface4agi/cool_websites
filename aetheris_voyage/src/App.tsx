import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/* Icons (inline lucide-style SVGs)                                    */
/* ------------------------------------------------------------------ */

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

function Play({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
    >
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* FadingVideo — custom rAF crossfade, manual looping                  */
/* ------------------------------------------------------------------ */

const FADE_MS = 500
const FADE_OUT_LEAD = 0.55

function FadingVideo({
  src,
  className,
  style,
}: {
  src: string
  className?: string
  style?: React.CSSProperties
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const fadingOutRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const fadeTo = (target: number, duration: number) => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      const start = parseFloat(video.style.opacity || '0')
      const startTime = performance.now()
      const step = (now: number) => {
        const t = duration <= 0 ? 1 : Math.min((now - startTime) / duration, 1)
        const value = start + (target - start) * t
        video.style.opacity = String(value)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          rafRef.current = null
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }

    const handleLoadedData = () => {
      video.style.opacity = '0'
      const playResult = video.play()
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(() => {})
      }
      fadeTo(1, FADE_MS)
    }

    const handleTimeUpdate = () => {
      const remaining = video.duration - video.currentTime
      if (!fadingOutRef.current && remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true
        fadeTo(0, FADE_MS)
      }
    }

    const handleEnded = () => {
      video.style.opacity = '0'
      setTimeout(() => {
        video.currentTime = 0
        const playResult = video.play()
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(() => {})
        }
        fadingOutRef.current = false
        fadeTo(1, FADE_MS)
      }, 100)
    }

    video.style.opacity = '0'
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ opacity: 0, ...style }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* BlurText — word-by-word blur-in on view                             */
/* ------------------------------------------------------------------ */

function BlurText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduceMotion) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <p
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: '0.1em',
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={
            inView
              ? {
                  filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0],
                }
              : { filter: 'blur(10px)', opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: 'easeOut',
            delay: (i * 100) / 1000,
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* Reusable motion fade-in (blur / opacity / y)                        */
/* ------------------------------------------------------------------ */

function FadeIn({
  delay = 0,
  className,
  children,
}: {
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? { opacity: 1 }
          : { filter: 'blur(10px)', opacity: 0, y: 20 }
      }
      animate={
        reduceMotion
          ? { opacity: 1 }
          : { filter: 'blur(0px)', opacity: 1, y: 0 }
      }
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const NAV_LINKS = ['Home', 'Voyages', 'Worlds', 'Innovation', 'Plan Launch']

function Navbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
      {/* Logo */}
      <div className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full">
        <span className="font-heading text-2xl italic leading-none text-white">a</span>
      </div>

      {/* Center pill (desktop) */}
      <div className="hidden items-center lg:flex">
        <div className="liquid-glass flex items-center rounded-full px-1.5 py-1.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="px-3 py-2 font-body text-sm font-medium text-white/90"
            >
              {link}
            </a>
          ))}
          <a
            href="#"
            className="ml-1 flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
          >
            Claim a Spot
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Right spacer */}
      <div className="h-12 w-12" aria-hidden="true" />
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Hero stat cards                                                     */
/* ------------------------------------------------------------------ */

function ClockIcon() {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
    </svg>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="liquid-glass flex w-[220px] flex-col rounded-[1.25rem] p-5">
      <div>{icon}</div>
      <div className="mt-6 font-heading text-4xl italic leading-none tracking-[-1px] text-white">
        {value}
      </div>
      <div className="mt-2 font-body text-xs font-light text-white">{label}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hero Section                                                        */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top"
        style={{ width: '120%', height: '120%' }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <Navbar />

        {/* Hero content */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
          {/* Badge */}
          <FadeIn delay={0.4}>
            <div className="liquid-glass flex items-center gap-2 rounded-full pr-3">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                New
              </span>
              <span className="text-sm text-white/90">
                Maiden Crewed Voyage to Mars Arrives 2026
              </span>
            </div>
          </FadeIn>

          {/* Headline */}
          <div className="mt-6">
            <BlurText
              text="Venture Past Our Sky Across the Universe"
              className="max-w-2xl justify-center font-heading text-6xl italic leading-[0.8] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]"
            />
          </div>

          {/* Subheading */}
          <FadeIn delay={0.8}>
            <p className="mt-4 max-w-2xl font-body text-sm font-light leading-tight text-white md:text-base">
              Discover the universe in ways once unimaginable. Our pioneering
              vessels and breakthrough engineering bring deep-space exploration
              within reach—secure and extraordinary.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={1.1}>
            <div className="mt-6 flex items-center gap-6">
              <a
                href="#"
                className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
              >
                Start Your Voyage
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm font-medium text-white"
              >
                View Liftoff
                <Play className="h-4 w-4" />
              </a>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={1.3}>
            <div className="mt-8 flex items-stretch gap-4">
              <StatCard
                icon={<ClockIcon />}
                value="34.5 Min"
                label="Average Videos Watch Time"
              />
              <StatCard
                icon={<GlobeIcon />}
                value="2.8B+"
                label="Users Across the Globe"
              />
            </div>
          </FadeIn>
        </div>

        {/* Partners */}
        <FadeIn delay={1.4}>
          <div className="flex flex-col items-center gap-4 pb-8">
            <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white">
              Collaborating with top aerospace pioneers globally
            </div>
            <div className="flex items-center gap-12 md:gap-16">
              {['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno'].map((name) => (
                <span
                  key={name}
                  className="font-heading text-2xl italic tracking-tight text-white md:text-3xl"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Capabilities Section                                                */
/* ------------------------------------------------------------------ */

function MaterialIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-white"
      width={24}
      height={24}
    >
      <path d={path} />
    </svg>
  )
}

const CARDS = [
  {
    iconPath:
      'M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z',
    tags: ['Natural Context', 'Photo Realism', 'Infinite Settings', 'Eco-Vibe'],
    title: 'AI Scenery',
    body:
      'AI analyzes your product to create indistinguishable natural environments — from Icelandic cliffs to misty forests.',
  },
  {
    iconPath:
      'M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z',
    tags: ['Scale Fast', 'Visual Consistency', 'Time Saver', 'Ready to Post'],
    title: 'Batch Production',
    body:
      'Style your entire product line in minutes. Create a unified visual identity for catalogues and social media without weeks of retouching.',
  },
  {
    iconPath:
      'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z',
    tags: ['Ray Tracing', 'Physical Shadows', 'Studio Quality', 'Sunlight Sync'],
    title: 'Smart Lighting',
    body:
      'Automatic lighting and material adjustment. Achieve flawless integration with realistic shadows and sunlight.',
  },
]

function Capabilities() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-8 pb-10 pt-24 md:px-16 lg:px-20">
        {/* Header */}
        <div className="mb-auto">
          <p className="mb-6 font-body text-sm text-white/80">// Capabilities</p>
          <h2 className="font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
            Production
            <br />
            evolved
          </h2>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-[0.75rem]">
                  <MaterialIcon path={card.iconPath} />
                </div>
                <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="liquid-glass whitespace-nowrap rounded-full px-3 py-1 font-body text-[11px] text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Bottom */}
              <div className="mt-6">
                <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">
                  {card.title}
                </h3>
                <p className="mt-3 max-w-[32ch] font-body text-sm font-light leading-snug text-white/90">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <main className="bg-black">
      <Hero />
      <Capabilities />
    </main>
  )
}
