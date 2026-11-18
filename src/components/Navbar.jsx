import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Logo from './ui/Logo'
import { ease } from '../lib/motion'

const LINKS = ['Play', 'About', 'Settings']

export default function Navbar({ onPlay }) {
  const [active, setActive] = useState('Play')
  const [hovered, setHovered] = useState(null)

  const handleClick = (link) => {
    setActive(link)
    if (link === 'Play') onPlay?.()
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.25 }}
      className="relative z-20 flex justify-center px-8 pt-7"
    >
      <nav className="glass flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-5 pr-2">
        <Logo />

        <ul
          className="flex items-center gap-1 rounded-full bg-white/30 p-1"
          onMouseLeave={() => setHovered(null)}
        >
          {LINKS.map((link) => {
            const isActive = active === link
            return (
              <li key={link}>
                <button
                  type="button"
                  onClick={() => handleClick(link)}
                  onMouseEnter={() => setHovered(link)}
                  className={`relative rounded-full px-6 py-2 text-[13px] transition-colors duration-300 ${
                    isActive ? 'text-cream' : 'text-ink/75 hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {hovered === link && !isActive && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-white/60"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <motion.button
          type="button"
          aria-label="Search"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/50 text-ink"
        >
          <Search size={16} strokeWidth={1.5} />
        </motion.button>
      </nav>
    </motion.header>
  )
}
