export const DEFAULT_SKILL_LEVEL = 2

export const DIFFICULTY_CONFIG = {
  easy: { skillLevel: 2, depth: 6 },
  medium: { skillLevel: 10, depth: 10 },
  hard: { skillLevel: 20, depth: 12 },
}

function clampSkillLevel(level) {
  const num = Number(level)
  if (!Number.isFinite(num)) return DEFAULT_SKILL_LEVEL
  return Math.max(0, Math.min(20, Math.round(num)))
}

function createCancelledError() {
  const err = new Error('Stockfish search cancelled')
  err.cancelled = true
  return err
}

/**
 * Parses a UCI move string (e.g., "e7e5" or "e2e1q") into a chess.js move object.
 */
export function parseUciMove(uciMove) {
  if (typeof uciMove !== 'string' || uciMove === '(none)' || uciMove.length < 4) {
    return null
  }
  const from = uciMove.slice(0, 2)
  const to = uciMove.slice(2, 4)
  const promotion = uciMove.length >= 5 ? uciMove[4] : undefined
  return promotion ? { from, to, promotion } : { from, to }
}

/**
 * UCI Web Worker wrapper around Stockfish 19 lite-single.
 */
export class StockfishService {
  constructor({ workerUrl, skillLevel = DEFAULT_SKILL_LEVEL, depth = 6 } = {}) {
    const baseUrl = import.meta.env?.BASE_URL ?? '/'
    this.workerUrl = workerUrl ?? `${baseUrl}stockfish/stockfish-19-lite-single.js`
    this.skillLevel = clampSkillLevel(skillLevel)
    this.depth = depth
    this.appliedSkillLevel = null
    this.optionDirty = false

    this.worker = null
    this.readyPromise = null
    this.initReject = null
    this.terminated = false

    this.isSearching = false
    this.searchCounter = 0
    this.pendingReady = null
    this.activeSearch = null
  }

  post(command) {
    if (this.worker && !this.terminated) {
      this.worker.postMessage(command)
    }
  }

  _cancelPending() {
    if (this.pendingReady) {
      const pending = this.pendingReady
      this.pendingReady = null
      pending.reject(createCancelledError())
    }
    if (this.activeSearch) {
      const active = this.activeSearch
      this.activeSearch = null
      clearTimeout(active.timer)
      active.reject(createCancelledError())
    }
  }

  /**
   * Spawns the Stockfish Web Worker and runs the initial UCI handshake.
   */
  init() {
    if (this.terminated) {
      return Promise.reject(createCancelledError())
    }
    if (this.readyPromise) {
      return this.readyPromise
    }

    this.readyPromise = new Promise((resolve, reject) => {
      this.initReject = reject
      let uciInitialized = false
      let initDone = false

      let worker
      try {
        // Classic worker (not module) so the Emscripten IIFE runs in WorkerGlobalScope
        worker = new Worker(this.workerUrl)
      } catch (err) {
        this.readyPromise = null
        this.initReject = null
        reject(err)
        return
      }

      this.worker = worker

      worker.onmessage = (event) => {
        if (this.terminated) return
        const payload = typeof event.data === 'string' ? event.data : String(event.data ?? '')

        for (const rawLine of payload.split(/\r?\n/)) {
          const line = rawLine.trim()
          if (!line) continue

          if (!uciInitialized) {
            if (line === 'uciok') {
              uciInitialized = true
              this.post(`setoption name Skill Level value ${this.skillLevel}`)
              this.appliedSkillLevel = this.skillLevel
              this.optionDirty = false
              this.post('ucinewgame')
              this.post('isready')
            }
            continue
          }

          if (!initDone) {
            if (line === 'readyok') {
              initDone = true
              this.initReject = null
              resolve()
            }
            continue
          }

          if (line === 'readyok' && this.pendingReady) {
            const pending = this.pendingReady
            this.pendingReady = null
            pending.resolve()
            continue
          }

          if (line.startsWith('bestmove')) {
            this.isSearching = false
            if (this.activeSearch) {
              const current = this.activeSearch
              this.activeSearch = null
              clearTimeout(current.timer)
              const moveToken = line.split(/\s+/)[1]
              current.resolve(!moveToken || moveToken === '(none)' ? null : moveToken)
            }
          }
        }
      }

      worker.onerror = (event) => {
        const err = new Error(event?.message || 'Stockfish worker error')
        if (!initDone) {
          this.readyPromise = null
          this.initReject = null
          reject(err)
        }
        if (this.pendingReady) {
          const pending = this.pendingReady
          this.pendingReady = null
          pending.reject(err)
        }
        if (this.activeSearch) {
          const active = this.activeSearch
          this.activeSearch = null
          this.isSearching = false
          clearTimeout(active.timer)
          active.reject(err)
        }
      }

      this.post('uci')
    })

    return this.readyPromise
  }

  /**
   * Updates skill level (0..20) and/or search depth for subsequent searches.
   */
  setConfig({ skillLevel, depth } = {}) {
    if (skillLevel !== undefined) {
      const nextSkill = clampSkillLevel(skillLevel)
      if (nextSkill !== this.skillLevel) {
        this.skillLevel = nextSkill
        this.optionDirty = true
      }
    }
    if (depth !== undefined) {
      this.depth = depth
    }
  }

  /**
   * Calculates the best move for a given FEN string.
   * Waits for UCI synchronization (`isready` -> `readyok`) before dispatching `go`
   * so any stale `bestmove` from an aborted search is ignored.
   */
  async getBestMove(fen, options = {}) {
    if (this.terminated) {
      throw createCancelledError()
    }

    if (!this.readyPromise) {
      this.init()
    }

    const searchId = ++this.searchCounter
    this._cancelPending()

    if (this.isSearching) {
      this.post('stop')
    }

    await this.readyPromise

    if (this.terminated || searchId !== this.searchCounter) {
      throw createCancelledError()
    }

    const targetSkill =
      options.skillLevel !== undefined ? clampSkillLevel(options.skillLevel) : this.skillLevel
    const targetDepth = options.depth !== undefined ? options.depth : this.depth

    if (targetSkill !== this.appliedSkillLevel || this.optionDirty) {
      this.post(`setoption name Skill Level value ${targetSkill}`)
      this.appliedSkillLevel = targetSkill
      this.optionDirty = false
    }

    await new Promise((resolve, reject) => {
      this.pendingReady = { resolve, reject }
      this.post('isready')
    })

    if (this.terminated || searchId !== this.searchCounter) {
      throw createCancelledError()
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.activeSearch?.searchId === searchId) {
          this.activeSearch = null
          this.isSearching = false
          this.post('stop')
          reject(new Error('Stockfish search timed out'))
        }
      }, 15000)

      this.isSearching = true
      this.activeSearch = { searchId, resolve, reject, timer }
      this.post(`position fen ${fen}`)
      this.post(`go depth ${targetDepth}`)
    })
  }

  stop() {
    this.searchCounter++
    this._cancelPending()
    if (this.isSearching && this.worker && !this.terminated) {
      this.post('stop')
      this.isSearching = false
    }
  }

  newGame() {
    this.stop()
    if (this.worker && !this.terminated) {
      this.post('ucinewgame')
      this.post('isready')
    }
  }

  terminate() {
    this.terminated = true
    this.searchCounter++
    this._cancelPending()
    if (this.initReject) {
      this.initReject(createCancelledError())
      this.initReject = null
    }
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.isSearching = false
    this.readyPromise = null
  }
}
