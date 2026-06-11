import { useEffect, useRef } from 'react'
import { Globe, ArrowRight, Instagram, Twitter } from 'lucide-react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4'

const FADE_DURATION = 500
const FADE_OUT_LEAD = 0.55

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number | null>(null)
  const fadingOutRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReduced) {
      video.style.opacity = '1'
      video.play().catch(() => {})
      return
    }

    const cancelRaf = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const fade = (target: number) => {
      cancelRaf()
      const start = performance.now()
      const startOpacity = parseFloat(video.style.opacity || '0')
      const delta = target - startOpacity

      const step = (now: number) => {
        const elapsed = now - start
        const t = Math.min(elapsed / FADE_DURATION, 1)
        video.style.opacity = String(startOpacity + delta * t)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          rafRef.current = null
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }

    const fadeIn = () => {
      fadingOutRef.current = false
      fade(1)
    }

    const fadeOut = () => {
      fadingOutRef.current = true
      fade(0)
    }

    const handleTimeUpdate = () => {
      if (fadingOutRef.current) return
      const remaining = video.duration - video.currentTime
      if (!Number.isNaN(remaining) && remaining <= FADE_OUT_LEAD) {
        fadeOut()
      }
    }

    const handleEnded = () => {
      video.style.opacity = '0'
      window.setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
        fadeIn()
      }, 100)
    }

    const handleLoadedData = () => {
      video.style.opacity = '0'
      video.play().catch(() => {})
      fadeIn()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadeddata', handleLoadedData)

    if (video.readyState >= 2) {
      handleLoadedData()
    }

    return () => {
      cancelRaf()
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
        style={{ opacity: 0 }}
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
        loop={false}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="relative z-20 pl-6 pr-6 py-6">
          <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Globe size={24} className="text-white" />
                <span className="text-white font-semibold text-lg">Asme</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  About
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white text-sm font-medium">Sign Up</button>
              <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Built for the curious
          </h1>

          <div className="max-w-xl w-full space-y-4">
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-base"
              />
              <button
                className="bg-white rounded-full p-3 text-black"
                aria-label="Submit email"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            <p className="text-white text-sm leading-relaxed px-4">
              Stay updated with the latest news and insights. Subscribe to our
              newsletter today and never miss out on exciting updates.
            </p>

            <div className="flex justify-center">
              <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
                Read our manifesto
              </button>
            </div>
          </div>
        </div>

        {/* Social icons footer */}
        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <button
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </button>
          <button
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </button>
          <button
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Website"
          >
            <Globe size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
