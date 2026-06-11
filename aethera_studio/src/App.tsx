import { useEffect, useRef } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

const FADE_DURATION = 0.5 // seconds

const navItems = [
  { label: 'Home', color: '#000000' },
  { label: 'Studio', color: '#6F6F6F' },
  { label: 'About', color: '#6F6F6F' },
  { label: 'Journal', color: '#6F6F6F' },
  { label: 'Reach Us', color: '#6F6F6F' },
]

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let rafId = 0
    let resetTimeout: ReturnType<typeof setTimeout> | undefined

    const updateOpacity = () => {
      const { currentTime, duration } = video
      if (!Number.isFinite(duration) || duration <= 0) {
        video.style.opacity = '0'
      } else {
        let opacity = 1
        // Fade in over the first FADE_DURATION seconds.
        if (currentTime < FADE_DURATION) {
          opacity = currentTime / FADE_DURATION
        }
        // Fade out over the last FADE_DURATION seconds.
        const timeLeft = duration - currentTime
        if (timeLeft < FADE_DURATION) {
          opacity = Math.min(opacity, timeLeft / FADE_DURATION)
        }
        video.style.opacity = String(Math.max(0, Math.min(1, opacity)))
      }
      rafId = requestAnimationFrame(updateOpacity)
    }

    const handleEnded = () => {
      // Seamless manual loop with a smooth fade transition.
      video.style.opacity = '0'
      resetTimeout = setTimeout(() => {
        video.currentTime = 0
        void video.play()
      }, 100)
    }

    video.addEventListener('ended', handleEnded)
    void video.play()
    rafId = requestAnimationFrame(updateOpacity)

    return () => {
      cancelAnimationFrame(rafId)
      if (resetTimeout) clearTimeout(resetTimeout)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background video layer */}
      <div
        className="absolute z-0"
        style={{ top: '300px', inset: 'auto 0 0 0' }}
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          autoPlay
          preload="auto"
          className="w-full h-auto object-cover"
          style={{ opacity: 0 }}
        />
        {/* Gradient overlay on video */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* Navigation bar */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">
          <a
            href="#"
            className="font-serif-display text-3xl tracking-tight"
            style={{ color: '#000000', fontFamily: "'Instrument Serif', serif" }}
          >
            Aethera<sup className="text-xs align-super">&reg;</sup>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className="text-sm transition-colors hover:text-black"
                  style={{ color: item.color }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="rounded-full px-6 py-2.5 text-sm transition-transform duration-200 hover:scale-[1.03]"
            style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
          >
            Begin Journey
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <h1
          className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal"
          style={{
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 0.95,
            letterSpacing: '-2.46px',
            color: '#000000',
          }}
        >
          Beyond <em style={{ color: '#6F6F6F' }}>silence,</em> we build{' '}
          <em style={{ color: '#6F6F6F' }}>the eternal.</em>
        </h1>

        <p
          className="animate-fade-rise-delay text-base sm:text-lg max-w-2xl mt-8 leading-relaxed"
          style={{ color: '#6F6F6F' }}
        >
          Building platforms for brilliant minds, fearless makers, and thoughtful
          souls. Through the noise, we craft digital havens for deep work and pure
          flows.
        </p>

        <button
          className="animate-fade-rise-delay-2 rounded-full px-14 py-5 text-base mt-12 transition-transform duration-200 hover:scale-[1.03]"
          style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
        >
          Begin Journey
        </button>
      </section>
    </div>
  )
}

export default App
