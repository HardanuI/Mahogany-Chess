import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import SetupModal from './components/SetupModal'
import GameLayout from './components/GameLayout'

const DEFAULT_SETTINGS = { difficulty: 'medium', time: '10', side: 'white' }

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
}

export default function App() {
  const [screen, setScreen] = useState('landing') // 'landing' | 'game'
  const [isSetupOpen, setSetupOpen] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const openSetup = useCallback(() => setSetupOpen(true), [])
  const closeSetup = useCallback(() => setSetupOpen(false), [])

  const startGame = (next) => {
    setSettings(next)
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
          <motion.div key={`game-${JSON.stringify(settings)}`} {...pageTransition}>
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
