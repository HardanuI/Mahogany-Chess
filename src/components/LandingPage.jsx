import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Cpu,
  Globe,
  Heart,
  House,
  LayoutGrid,
  Play,
  Trophy,
  Users,
} from 'lucide-react'
import Navbar from './Navbar'
import PillButton from './ui/PillButton'
import BoardPlaceholder from './BoardPlaceholder'
import { ease, fadeUp, stagger } from '../lib/motion'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80'
const FRAME_IMAGE =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=60'

// Morphy's "Opera Game" (1858), final position — used purely as decoration.
const OPERA_FEN = '1n1Rkb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2K5'
// A calm Italian-opening position for the floating preview card.
const PREVIEW_FEN = 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R'

const RAIL_ICONS = [House, LayoutGrid, Trophy, BookOpen, Heart]
const TAGS = ['Timeless', 'Strategic', 'Focused', 'Elegant']
const STATS = [
  { icon: Cpu, value: '3,200', label: 'Engine Elo' },
  { icon: Users, value: '120K+', label: 'Players' },
  { icon: Globe, value: '40+', label: 'Countries' },
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
          {/* Warm gradient overlays */}
          <div aria-hidden className="absolute inset-0 bg-[#E9C9A0]/25 mix-blend-multiply" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-cream/0"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-cream/50 via-transparent to-[#3A2A1C]/35"
          />

          <Navbar onPlay={onPlay} />

          <div className="relative z-10 flex flex-1 gap-8 px-8 pb-8 pt-10 lg:px-10">
            <SideRail />

            <div className="flex flex-1 flex-col">
              {/* Top: hero copy + right column */}
              <div className="flex items-start justify-between gap-10">
                <motion.div
                  variants={stagger(0.45, 0.12)}
                  initial="hidden"
                  animate="show"
                  className="max-w-2xl pt-2"
                >
                  <motion.p variants={fadeUp} className="eyebrow flex items-center gap-3">
                    Strategy <span className="h-px w-8 bg-ink/30" /> Focus{' '}
                    <span className="h-px w-8 bg-ink/30" /> Mastery
                  </motion.p>

                  <motion.h1
                    variants={fadeUp}
                    className="mt-6 font-serif text-[5.75rem] font-normal leading-[0.95] tracking-[-0.02em] text-ink"
                  >
                    Master
                    <br />
                    The <span className="text-umber">Game.</span>
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    className="mt-7 max-w-sm text-[15px] leading-relaxed text-ink/70"
                  >
                    A quiet, considered space for the oldest game of the mind. Face a refined
                    engine at your own pace — nothing more, nothing less.
                  </motion.p>

                  <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6">
                    <PillButton onClick={onPlay}>Play Now</PillButton>

                    <motion.button
                      type="button"
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="flex items-center gap-3 text-sm text-ink/80"
                    >
                      <motion.span
                        variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 bg-white/40 backdrop-blur-md"
                      >
                        <Play size={15} strokeWidth={1.5} className="ml-0.5" />
                      </motion.span>
                      Watch Masterclass
                    </motion.button>
                  </motion.div>
                </motion.div>

                <div className="hidden flex-col items-end gap-8 lg:flex">
                  <motion.ul
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.7 }}
                    className="border-l border-ink/30 pl-3 text-[10px] uppercase leading-5 tracking-[0.25em] text-ink/70"
                  >
                    {TAGS.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </motion.ul>

                  <PreviewCard />
                </div>
              </div>

              {/* Bottom: card row */}
              <motion.div
                variants={stagger(0.9, 0.12)}
                initial="hidden"
                animate="show"
                className="mt-auto grid grid-cols-[1.35fr_1fr_0.8fr] gap-5 pt-10"
              >
                <FeaturedCard />
                <StatsCard />
                <CtaCard onPlay={onPlay} />
              </motion.div>
            </div>
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
      className="glass hidden shrink-0 flex-col items-center gap-2 self-start rounded-full p-2 xl:flex"
    >
      {RAIL_ICONS.map((Icon, i) => (
        <motion.button
          key={i}
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            i === 0 ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-white/60 hover:text-ink'
          }`}
        >
          <Icon size={17} strokeWidth={1.5} />
        </motion.button>
      ))}
      <span className="my-1 h-px w-6 bg-ink/15" />
      <div className="h-11 w-11 overflow-hidden rounded-full border border-white/70">
        <BoardPlaceholder
          fen="8/8/8/3k4/4K3/8/8/8"
          framed={false}
          showCoordinates={false}
          animated={false}
          className="scale-[1.6]"
        />
      </div>
      <button type="button" className="mt-1 flex flex-col items-center gap-1.5 pb-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 bg-white/50">
          <Play size={14} strokeWidth={1.5} className="ml-0.5" />
        </span>
        <span className="text-center text-[9px] leading-tight text-ink/60">
          Watch
          <br />
          Tutorial
        </span>
      </button>
    </motion.aside>
  )
}

function PreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1.2, ease, delay: 0.8 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="glass w-[280px] rounded-[2rem] p-3"
      >
        <BoardPlaceholder
          fen={PREVIEW_FEN}
          framed={false}
          showCoordinates={false}
          delay={1}
        />
        <div className="flex items-center justify-between px-2 pb-1 pt-3">
          <div>
            <p className="eyebrow !text-[9px]">Live preview</p>
            <p className="mt-1 font-serif text-[15px]">Italian Game</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-[11px] text-ink/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-olive" />
            Move 5
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FeaturedCard() {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="glass-strong flex gap-5 rounded-[2rem] p-3"
    >
      <div className="relative w-40 shrink-0 overflow-hidden rounded-[1.5rem]">
        <BoardPlaceholder
          fen={OPERA_FEN}
          framed={false}
          showCoordinates={false}
          animated={false}
          className="h-full [&>div]:h-full [&>div]:rounded-none"
        />
        <span className="absolute left-2 top-2 rounded-full bg-cream/85 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.2em] text-ink/80 backdrop-blur">
          Daily Puzzle
        </span>
      </div>

      <div className="flex flex-1 flex-col py-2 pr-2">
        <div className="flex items-start justify-between">
          <h3 className="font-serif text-[22px] leading-tight">The Opera Game</h3>
          <span className="mt-1 text-[11px] text-ink/50">01 / 06</span>
        </div>
        <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-ink/60">
          Morphy, Paris 1858. Revisit the immortal finish played beneath the opera lights.
        </p>
        <button
          type="button"
          className="group mt-3 flex w-fit items-center gap-1.5 text-xs font-medium text-ink"
        >
          View Puzzle
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-[2px] w-6 rounded-full bg-ink" />
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-[2px] w-3 rounded-full bg-ink/20" />
            ))}
          </div>
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70"
            >
              <ArrowLeft size={15} strokeWidth={1.5} />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream"
            >
              <ArrowRight size={15} strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function StatsCard() {
  return (
    <motion.div
      variants={fadeUp}
      className="glass grid grid-cols-3 items-center self-end rounded-[2rem] px-4 py-7"
    >
      {STATS.map(({ icon: Icon, value, label }, i) => (
        <div
          key={label}
          className={`flex flex-col items-center gap-2 text-center ${
            i !== 0 ? 'border-l border-ink/10' : ''
          }`}
        >
          <Icon size={20} strokeWidth={1.5} className="text-ink/70" />
          <p className="mt-1 font-serif text-2xl leading-none">{value}</p>
          <p className="text-[11px] text-ink/55">{label}</p>
        </div>
      ))}
    </motion.div>
  )
}

function CtaCard({ onPlay }) {
  return (
    <motion.button
      type="button"
      onClick={onPlay}
      variants={fadeUp}
      whileHover="hover"
      className="glass-dark group flex flex-col rounded-[2rem] p-6 text-left"
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
      <h3 className="mt-auto pt-6 font-serif text-[22px] leading-tight">
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
