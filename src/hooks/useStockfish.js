import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DEFAULT_SKILL_LEVEL,
  DIFFICULTY_CONFIG,
  StockfishService,
} from '../services/stockfishService'

/**
 * React hook that manages a Stockfish Web Worker engine instance.
 * Defaults to Level 2 ('easy') when no difficulty or skillLevel is specified.
 */
export default function useStockfish({ difficulty = 'easy', skillLevel, depth } = {}) {
  const preset = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.easy
  const resolvedSkill = skillLevel ?? preset.skillLevel ?? DEFAULT_SKILL_LEVEL
  const resolvedDepth = depth ?? preset.depth ?? 6

  const serviceRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const service = new StockfishService({
      skillLevel: resolvedSkill,
      depth: resolvedDepth,
    })
    serviceRef.current = service

    service
      .init()
      .then(() => {
        if (!cancelled) {
          setIsReady(true)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled && !err?.cancelled) {
          setError(err)
        }
      })

    return () => {
      cancelled = true
      service.terminate()
      if (serviceRef.current === service) {
        serviceRef.current = null
      }
      setIsReady(false)
    }
    // Worker initializes once per mount; config updates are sent via setConfig below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    serviceRef.current?.setConfig({
      skillLevel: resolvedSkill,
      depth: resolvedDepth,
    })
  }, [resolvedSkill, resolvedDepth])

  const getBestMove = useCallback((fen, options) => {
    if (!serviceRef.current) {
      return Promise.reject(new Error('Stockfish service is not initialized'))
    }
    return serviceRef.current.getBestMove(fen, options)
  }, [])

  const stop = useCallback(() => {
    serviceRef.current?.stop()
  }, [])

  const resetEngine = useCallback(() => {
    serviceRef.current?.newGame()
  }, [])

  return { isReady, error, getBestMove, stop, resetEngine }
}
