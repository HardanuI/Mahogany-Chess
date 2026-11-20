import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import SetupModal from './components/SetupModal'
import GameLayout from './components/GameLayout'

const DEFAULT_SETTINGS = { difficulty: 'easy', time: '10', side: 'white' }
const SCREEN_STORAGE_KEY = 'arbiter_active_screen'

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
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [matchId, setMatchId] = useState(1)

  useEffect(() => {
    try {
      sessionStorage.setItem(SCREEN_STORAGE_KEY, screen)
    } catch {
      // ignore storage errors
    }
  }, [screen])

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
