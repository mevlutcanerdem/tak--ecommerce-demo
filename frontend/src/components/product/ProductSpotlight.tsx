import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { classNames } from '@/lib/utils'

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const

interface ProductSpotlightProps {
  images: string[]
  alt: string
}

function Sparkle({
  top,
  left,
  delay,
  size = 14,
}: {
  top: string
  left: string
  delay: number
  size?: number
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="pointer-events-none absolute z-30 text-cream-50 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
      style={{ top, left, width: size, height: size }}
      initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3], rotate: 25 }}
      transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, delay, ease: 'easeInOut' }}
    >
      <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" />
    </motion.svg>
  )
}

export function ProductSpotlight({ images, alt }: ProductSpotlightProps) {
  const [activeImage, setActiveImage] = useState(0)
  const reduceMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    })
  }

  const activeSrc = images[activeImage] ?? images[0]

  return (
    <div>
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSpot((s) => ({ ...s, active: false }))}
        className="spotlight-stage relative aspect-square w-full overflow-hidden rounded-sm bg-charcoal shadow-lift"
      >
        {/* Product image reveal */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSrc}
            src={activeSrc}
            alt={alt}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileHover={reduceMotion ? undefined : { scale: 1.035 }}
            transition={{ duration: 0.85, ease: REVEAL_EASE }}
            className="relative z-[1] h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Spotlight vignette — darkens the edges so the piece reads as lit from above */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 38%, transparent 35%, rgba(33,31,29,0.55) 100%)',
          }}
        />

        {/* Warm gallery-light bloom, blended into the photo rather than hidden behind it */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[15%] left-1/2 z-[3] h-[70%] w-[75%] -translate-x-1/2 rounded-full bg-gold-300 opacity-60 mix-blend-soft-light blur-[60px] animate-glow-pulse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[10%] -right-[5%] z-[3] h-[50%] w-[50%] rounded-full bg-gold-200 opacity-40 mix-blend-soft-light blur-[55px] animate-glow-drift"
        />

        {/* Cursor-tracked highlight, like a hand-held light catching a facet */}
        {!reduceMotion && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[4] mix-blend-soft-light transition-opacity duration-500"
            style={{
              opacity: spot.active ? 1 : 0,
              background: `radial-gradient(280px circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.9), transparent 70%)`,
            }}
          />
        )}

        {/* One-shot light sweep across the facets on reveal */}
        {!reduceMotion && (
          <motion.div
            key={`sweep-${activeSrc}`}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5] mix-blend-soft-light"
            initial={{ x: '-130%' }}
            animate={{ x: '130%' }}
            transition={{ duration: 1.1, delay: 0.25, ease: 'easeInOut' }}
            style={{
              background:
                'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)',
            }}
          />
        )}

        {/* Sparkle glints */}
        {!reduceMotion && (
          <>
            <Sparkle top="16%" left="20%" delay={0.6} size={12} />
            <Sparkle top="62%" left="80%" delay={1.5} size={16} />
            <Sparkle top="34%" left="86%" delay={2.4} size={10} />
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`${index + 1}. görsel`}
              aria-current={activeImage === index}
              className={classNames(
                'aspect-square overflow-hidden rounded-sm border-2 bg-charcoal transition-colors duration-300',
                activeImage === index
                  ? 'border-gold-500'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
