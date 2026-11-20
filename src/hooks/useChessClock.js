import { useCallback, useEffect, useRef, useState } from 'react'

export const DEFAULT_TIME_SECONDS = 300 // 5 minutes
export const LOW_TIME_THRESHOLD_SECONDS = 30

/**
 * Converts a setup time control option ('unlimited', '5', '10', etc.)
 * into total starting seconds, or null for unlimited clocks.
 */
export function parseTimeControlSeconds(timeSetting) {
  if (timeSetting === 'unlimited' || timeSetting === null) {
    return null
  }
  const minutes = Number(timeSetting)
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return DEFAULT_TIME_SECONDS
  }
  return Math.round(minutes * 60)
}

/**
 * Formats seconds as MM:SS (e.g., 299 -> "04:59"), or "∞" when unlimited.
 */
export function formatClockTime(seconds) {
  if (seconds === null || seconds === undefined) {
    return '∞'
  }
  const clamped = Math.max(0, Math.floor(seconds))
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Turn-based chess clock hook for White and Black.
 * Only decreases the active player's timer and halts immediately when the game ends.
 */
export default function useChessClock({
  initialSeconds = DEFAULT_TIME_SECONDS,
  activeTurn = 'w',
  isGameOver = false,
  isPaused = false,
  onTimeout,
} = {}) {
  const isUnlimited = initialSeconds === null
  const initialMs = isUnlimited ? null : initialSeconds * 1000

  const [whiteTimeMs, setWhiteTimeMs] = useState(initialMs)
  const [blackTimeMs, setBlackTimeMs] = useState(initialMs)

  const onTimeoutRef = useRef(onTimeout)
  const timeoutFiredRef = useRef(false)
  const lastTickRef = useRef(Date.now())

  onTimeoutRef.current = onTimeout

  const whiteTime = isUnlimited ? null : Math.ceil(whiteTimeMs / 1000)
  const blackTime = isUnlimited ? null : Math.ceil(blackTimeMs / 1000)
  const timedOutColor = isUnlimited
    ? null
    : whiteTimeMs <= 0
      ? 'w'
      : blackTimeMs <= 0
        ? 'b'
        : null

  // Reset clocks whenever time control changes
  useEffect(() => {
    setWhiteTimeMs(initialMs)
    setBlackTimeMs(initialMs)
    timeoutFiredRef.current = false
  }, [initialMs])

  // Tick down only the active player's clock while the game is ongoing and unpaused
  useEffect(() => {
    if (isUnlimited || isGameOver || isPaused || timedOutColor) {
      return
    }

    lastTickRef.current = Date.now()

    const intervalId = setInterval(() => {
      const now = Date.now()
      const delta = Math.max(0, now - lastTickRef.current)
      lastTickRef.current = now

      if (activeTurn === 'w') {
        setWhiteTimeMs((prev) => Math.max(0, prev - delta))
      } else {
        setBlackTimeMs((prev) => Math.max(0, prev - delta))
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [activeTurn, isGameOver, isPaused, isUnlimited, timedOutColor])

  // Notify listener once when either clock reaches 0
  useEffect(() => {
    if (timedOutColor && !timeoutFiredRef.current) {
      timeoutFiredRef.current = true
      onTimeoutRef.current?.(timedOutColor)
    }
  }, [timedOutColor])

  const resetClock = useCallback(() => {
    setWhiteTimeMs(initialMs)
    setBlackTimeMs(initialMs)
    timeoutFiredRef.current = false
  }, [initialMs])

  return {
    whiteTime,
    blackTime,
    formattedWhiteTime: formatClockTime(whiteTime),
    formattedBlackTime: formatClockTime(blackTime),
    isWhiteLowTime: !isUnlimited && whiteTime < LOW_TIME_THRESHOLD_SECONDS,
    isBlackLowTime: !isUnlimited && blackTime < LOW_TIME_THRESHOLD_SECONDS,
    timedOutColor,
    isUnlimited,
    resetClock,
  }
}
