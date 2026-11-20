import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import SetupModal from './components/SetupModal'
import GameLayout from './components/GameLayout'

const DEFAULT_SETTINGS = { difficulty: 'easy', time: '5', side: 'white' }
const SCREEN_STORAGE_KEY = 'arbiter_active_screen'
const SETTINGS_STORAGE_KEY = 'arbiter_game_settings'

const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard'])
const VALID_TIMES = new Set(['unlimited', '5', '10'])
const VALID_SIDES = new Set(['white', 'black'])

function loadStoredSettings() {
  try {
    const raw = sessionStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    return {
      difficulty: VALID_DIFFICULTIES.has(parsed?.difficulty)
        ? parsed.difficulty
        : DEFAULT_SETTINGS.difficulty,
      time: VALID_TIMES.has(parsed?.time) ? parsed.time : DEFAULT_SETTINGS.time,
      side: VALID_SIDES.has(parsed?.side) ? parsed.side : DEFAULT_SETTINGS.side,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.35 } },
}

export default function App() {
  const [screen, setScreen] = useState(() => {
    try {
      return sessionStorage.getItem(SCREEN_STORAGE_KEY) || 'landing'
    } catch {
      return 'landing'
    }
  })
  const [isSetupOpen, setSetupOpen] = useState(false)
  const [settings, setSettings] = useState(loadStoredSettings)
  const [matchId, setMatchId] = useState(1)

  useEffect(() => {
    try {
      sessionStorage.setItem(SCREEN_STORAGE_KEY, screen)
    } catch {
      // ignore storage errors
    }
  }, [screen])

  useEffect(() => {
    try {
      sessionStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // ignore storage errors
    }
  }, [settings])

  const openSetup = useCallback(() => setSetupOpen(true), [])
  const closeSetup = useCallback(() => setSetupOpen(false), [])

  const startGame = (next) => {
    setSettings(next)
    setMatchId((id) => id + 1)
    setSetupOpen(false)
    setScreen('game')
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === 'landing' ? (
          <motion.div key="landing" {...pageTransition}>
            <LandingPage onPlay={openSetup} />
          </motion.div>
        ) : (
          <motion.div key={`game-${matchId}`} {...pageTransition}>
            <GameLayout
              settings={settings}
              isPaused={isSetupOpen}
              onExit={() => setScreen('landing')}
              onNewGame={openSetup}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SetupModal open={isSetupOpen} initial={settings} onClose={closeSetup} onStart={startGame} />
    </>
  )
}
