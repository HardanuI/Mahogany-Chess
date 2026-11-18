import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const SIZES = {
  sm: { button: 'h-11 pl-5 pr-1 gap-3 text-[13px]', circle: 'h-9 w-9', icon: 15 },
  md: { button: 'h-[54px] pl-7 pr-1.5 gap-4 text-sm', circle: 'h-[42px] w-[42px]', icon: 17 },
  lg: { button: 'h-16 pl-8 pr-2 gap-5 text-[15px]', circle: 'h-12 w-12', icon: 19 },
}

/**
 * Dark pill button with a cream circular arrow — modelled after the
 * "Start a Project" button from the reference design.
 */
export default function PillButton({
  children,
  icon: Icon = ArrowRight,
  size = 'md',
  className = '',
  ...props
}) {
  const s = SIZES[size]

  return (
    <motion.button
      type="button"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      variants={{ rest: { y: 0 }, hover: { y: -2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`group relative inline-flex items-center overflow-hidden rounded-full bg-ink font-medium tracking-wide text-cream shadow-ink ${s.button} ${className}`}
      {...props}
    >
      {/* Soft sheen sweeping across on hover */}
      <motion.span
        aria-hidden
        variants={{ rest: { x: '-120%' }, hover: { x: '120%' } }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <span className="relative">{children}</span>
      <motion.span
        variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
        className={`relative flex shrink-0 items-center justify-center rounded-full bg-cream text-ink ${s.circle}`}
      >
        <motion.span
          variants={{ rest: { x: 0 }, hover: { x: 3 } }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex"
        >
          <Icon size={s.icon} strokeWidth={1.5} />
        </motion.span>
      </motion.span>
    </motion.button>
  )
}
