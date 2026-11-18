import { Crown } from 'lucide-react'

export default function Logo({ tone = 'dark' }) {
  const isDark = tone === 'dark'
  return (
    <span className="flex items-center gap-3">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          isDark ? 'bg-ink text-cream' : 'bg-cream text-ink'
        }`}
      >
        <Crown size={16} strokeWidth={1.5} />
      </span>
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.42em] ${
          isDark ? 'text-ink' : 'text-cream'
        }`}
      >
        Arbiter
      </span>
    </span>
  )
}
