import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Heart, House, LayoutGrid, Trophy } from 'lucide-react'
import Navbar from './Navbar'
import PillButton from './ui/PillButton'
import { ease, fadeUp, stagger } from '../lib/motion'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80'
const FRAME_IMAGE =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=60'

const RAIL_ITEMS = [
  { icon: House, label: 'Home' },
  { icon: LayoutGrid, label: 'Modes' },
  { icon: Trophy, label: 'Rankings' },
  { icon: BookOpen, label: 'Rules' },
  { icon: Heart, label: 'Favorites' },
]

export default function LandingPage({ onPlay }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cream-300">
      {/* Outer architectural backdrop — desaturated landscape */}
      <div
        aria-hidden
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-50 blur-[2px] grayscale"
        style={{ backgroundImage: `url(${FRAME_IMAGE})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/40 to-cream/80"
      />

      <main className="relative mx-auto flex min-h-screen max-w-[1440px] items-center justify-center p-5 lg:p-8">
        <motion.section
          initial={{ opacity: 0, y: 32, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease }}
          className="grain relative flex min-h-[min(880px,calc(100vh-4rem))] w-full flex-col overflow-hidden rounded-[2.5rem] border border-white/50 bg-[#E6D7C0] shadow-frame"
        >
          {/* Hero image with slow Ken-Burns settle */}
          <motion.div
            aria-hidden
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.6, ease }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          {/* Soft warm tint & centered radial veil */}
          <div aria-hidden className="absolute inset-0 bg-[#E9C9A0]/25 mix-blend-multiply" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,242,235,0.88)_0%,rgba(245,242,235,0.58)_50%,rgba(245,242,235,0.16)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-cream/55 via-cream/10 to-[#3A2A1C]/35"
          />

          <Navbar onPlay={onPlay} />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pb-12 pt-8 lg:px-28 lg:pb-16">
            <SideRail />

            {/* Centered hero focal point */}
            <motion.div
              variants={stagger(0.45, 0.12)}
              initial="hidden"
              animate="show"
              className="mx-auto flex max-w-xl flex-col items-center text-center"
            >
              <motion.p variants={fadeUp} className="eyebrow flex items-center justify-center gap-3">
                Strategy <span className="h-px w-8 bg-ink/30" /> Focus{' '}
                <span className="h-px w-8 bg-ink/30" /> Mastery
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="mt-6 font-serif text-6xl font-normal leading-[0.95] tracking-[-0.02em] text-ink sm:text-7xl lg:text-[5.75rem]"
              >
                Master
                <br />
                The <span className="text-umber">Game.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-7 max-w-md text-[15px] leading-relaxed text-ink/70"
              >
                A quiet, considered space for the oldest game of the mind. Face a refined engine
                at your own pace — nothing more, nothing less.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10">
                <PillButton size="lg" onClick={onPlay}>
                  Play Now
                </PillButton>
              </motion.div>
            </motion.div>

            <CtaCard onPlay={onPlay} />
          </div>
        </motion.section>
      </main>
    </div>
  )
}

/* ---------- Landing sub-components ---------- */

function SideRail() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.5 }}
      className="glass hidden shrink-0 flex-col items-center gap-2 rounded-full p-2 lg:absolute lg:left-8 lg:top-1/2 lg:flex lg:-translate-y-1/2"
    >
      {RAIL_ITEMS.map(({ icon: Icon, label }, i) => (
        <motion.button
          key={label}
          type="button"
          aria-label={label}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            i === 0 ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-white/60 hover:text-ink'
          }`}
        >
          <Icon size={17} strokeWidth={1.5} />
        </motion.button>
      ))}
    </motion.aside>
  )
}

function CtaCard({ onPlay }) {
  return (
    <motion.button
      type="button"
      onClick={onPlay}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.7 }}
      whileHover="hover"
      className="glass-dark group mt-12 flex w-full max-w-[260px] flex-col rounded-[2rem] p-6 text-left lg:absolute lg:bottom-8 lg:right-8 lg:mt-0"
    >
      <div className="flex w-full items-start justify-between">
        <span className="piece-glyph flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-cream">
          ♚{'\uFE0E'}
        </span>
        <motion.span
          variants={{ hover: { rotate: 45, scale: 1.08 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink"
        >
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </motion.span>
      </div>
      <h3 className="mt-6 font-serif text-[22px] leading-tight">
        Begin Your
        <br />
        First Match
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-cream/60">
        Choose your rival, set the clock, make the first move.
      </p>
    </motion.button>
  )
}
