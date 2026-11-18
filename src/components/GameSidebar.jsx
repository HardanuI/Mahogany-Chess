import { motion } from 'framer-motion'
import { Flag, History as HistoryIcon, House, Settings, Volume2 } from 'lucide-react'
import { ease } from '../lib/motion'

/**
 * Vertical floating glass toolbar for in-game actions (visual only).
 */
export default function GameSidebar({ onExit }) {
  const items = [
    { icon: House, label: 'Home', onClick: onExit },
    { icon: Settings, label: 'Settings' },
    { icon: HistoryIcon, label: 'History' },
    { icon: Volume2, label: 'Sound' },
  ]

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.3 }}
      className="glass flex flex-col items-center gap-2 justify-self-start rounded-full p-2.5"
    >
      {items.map((item, i) => (
        <SidebarButton key={item.label} {...item} active={i === 2} />
      ))}
      <span className="my-1.5 h-px w-6 bg-ink/15" />
      <SidebarButton icon={Flag} label="Resign" danger />
    </motion.aside>
  )
}

function SidebarButton({ icon: Icon, label, onClick, active = false, danger = false }) {
  return (
    <div className="group relative">
      <motion.button
        type="button"
        aria-label={label}
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 ${
          active
            ? 'bg-ink text-cream'
            : danger
              ? 'text-umber-dark hover:bg-umber hover:text-cream'
              : 'text-ink/70 hover:bg-white/70 hover:text-ink'
        }`}
      >
        <Icon size={18} strokeWidth={1.5} />
      </motion.button>

      {/* Tooltip */}
      <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[11px] text-cream opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        {label}
      </span>
    </div>
  )
}
