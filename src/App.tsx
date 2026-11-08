import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'
import type { Square, PieceSymbol, Move } from 'chess.js'
import type { GameMode, Color, GameStatus, PeerMessage, CpuDifficulty, TimeControl } from './types'
import { evaluateGameStatus, computeCapturedPieces } from './utils/chess'
import { getBestCpuMove } from './utils/ai'
import { recordMatchResult, resetPlayerStats } from './utils/stats'
import { peerService } from './services/peerService'
import type { ConnectionState } from './services/peerService'
import { haptics } from './utils/haptics'
import { Lobby } from './components/Lobby'
import { Board } from './components/Board'
import { GameHeader } from './components/GameHeader'
import { GameFooter } from './components/GameFooter'
import { MoveHistory } from './components/MoveHistory'
import { PromotionModal } from './components/PromotionModal'
import { GameOverModal } from './components/GameOverModal'
import { SettingsModal } from './components/SettingsModal'

export const App: React.FC = () => {
  // Navigation / Mode
  const [view, setView] = useState<'lobby' | 'game'>('lobby')
  const [gameMode, setGameMode] = useState<GameMode>('local')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Configurable Settings with LocalStorage persistence
  const [cpuDifficulty, setCpuDifficulty] = useState<CpuDifficulty>(() => {
    return (localStorage.getItem('d64_cpu_diff') as CpuDifficulty) || 'medium'
  })
  const [cpuPlayerColor, setCpuPlayerColor] = useState<Color>(() => {
    return (localStorage.getItem('d64_cpu_color') as Color) || 'w'
  })
  const [timeControl, setTimeControl] = useState<TimeControl>(() => {
    const saved = localStorage.getItem('d64_time_control')
    return saved !== null ? (Number(saved) as TimeControl) : 0
  })
  const [clocks, setClocks] = useState<{ w: number; b: number }>({ w: 0, b: 0 })

  // Save settings when changed
  const handleSelectCpuDifficulty = (diff: CpuDifficulty) => {
    setCpuDifficulty(diff)
    localStorage.setItem('d64_cpu_diff', diff)
  }

  const handleSelectCpuPlayerColor = (color: Color) => {
    setCpuPlayerColor(color)
    localStorage.setItem('d64_cpu_color', color)
  }

  const handleSelectTimeControl = (tc: TimeControl) => {
    setTimeControl(tc)
    localStorage.setItem('d64_time_control', String(tc))
  }

  // Peer & Room state
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('')
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')

  // Chess Game State
  const [chess] = useState(() => new Chess())
  const [fen, setFen] = useState(chess.fen())
  const [playerColor, setPlayerColor] = useState<Color>('w')
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [validMoves, setValidMoves] = useState<Move[]>([])
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null)
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>(() => evaluateGameStatus(chess))

  const isCpuThinking = useRef(false)
  const hasRecordedStats = useRef(false)

  // Force re-renders and sync state
  const updateGameState = useCallback(() => {
    setFen(chess.fen())
    const status = evaluateGameStatus(chess)
    setGameStatus(status)

    if (status.inCheck) {
      haptics.check()
    }
  }, [chess])

  // Record Player Stats when match ends
  useEffect(() => {
    if (gameStatus.isOver && !hasRecordedStats.current && (gameMode === 'cpu' || gameMode === 'online')) {
      hasRecordedStats.current = true
      if (gameStatus.winner === 'draw') {
        recordMatchResult('draw')
      } else if (gameStatus.winner === playerColor) {
        recordMatchResult('win')
      } else {
        recordMatchResult('loss')
      }
    }
  }, [gameStatus.isOver, gameStatus.winner, gameMode, playerColor])

  // Process a move
  const applyMove = useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol) => {
      try {
        const moveResult = chess.move({
          from,
          to,
          promotion: promotion || 'q'
        })

        if (moveResult) {
          setLastMove({ from, to })
          setSelectedSquare(null)
          setValidMoves([])

          if (moveResult.captured) {
            haptics.capture()
          } else {
            haptics.move()
          }

          updateGameState()
          return true
        }
      } catch (err) {
        console.warn('Lance inválido:', err)
      }
      return false
    },
    [chess, updateGameState]
  )

  // Chess Clock Interval
  useEffect(() => {
    if (view !== 'game' || timeControl === 0 || gameStatus.isOver) {
      return
    }

    const timer = setInterval(() => {
      setClocks((prev) => {
        const currentTurn = chess.turn()
        const newTime = prev[currentTurn] - 1

        if (newTime <= 0) {
          const winner: Color = currentTurn === 'w' ? 'b' : 'w'
          setGameStatus({
            isOver: true,
            winner,
            reason: 'timeout',
            inCheck: false
          })
          haptics.fallen()

          if (gameMode === 'online') {
            peerService.sendMessage({ type: 'TIMEOUT' })
          }

          return { ...prev, [currentTurn]: 0 }
        }

        return { ...prev, [currentTurn]: newTime }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [view, timeControl, gameStatus.isOver, chess, gameMode])

  // CPU Automated Move Listener
  useEffect(() => {
    if (view !== 'game' || gameMode !== 'cpu' || gameStatus.isOver || isCpuThinking.current) {
      return
    }

    const currentTurn = chess.turn()
    if (currentTurn !== playerColor) {
      isCpuThinking.current = true

      const timer = setTimeout(() => {
        try {
          const bestMove = getBestCpuMove(chess, cpuDifficulty)
          if (bestMove) {
            applyMove(bestMove.from as Square, bestMove.to as Square, bestMove.promotion as PieceSymbol)
          }
        } catch (e) {
          console.error('Erro ao calcular lance da CPU:', e)
        } finally {
          isCpuThinking.current = false
        }
      }, 450)

      return () => {
        clearTimeout(timer)
        isCpuThinking.current = false
      }
    }
  }, [view, gameMode, gameStatus.isOver, playerColor, fen, chess, cpuDifficulty, applyMove])

  // PeerJS setup & listener
  useEffect(() => {
    peerService.setup({
      onStatusChange: (status, message) => {
        setConnectionState(status)
        if (message) setConnectionStatus(message)

        if (status === 'connected') {
          hasRecordedStats.current = false
          setGameMode('online')
          setView('game')
          const isHost = peerService.getIsHost()
          setPlayerColor(isHost ? 'w' : 'b')
          setIsFlipped(!isHost)
        }
      },
      onPeerOpen: (_, code) => {
        setRoomCode(code)
      },
      onMessage: (msg: PeerMessage) => {
        if (msg.type === 'MOVE' && msg.move) {
          applyMove(msg.move.from, msg.move.to, msg.move.promotion)
          if (msg.timeRemaining) {
            setClocks(msg.timeRemaining)
          }
        } else if (msg.type === 'RESTART') {
          hasRecordedStats.current = false
          chess.reset()
          setLastMove(null)
          setSelectedSquare(null)
          setValidMoves([])
          setClocks({ w: timeControl, b: timeControl })
          updateGameState()
        } else if (msg.type === 'SURRENDER') {
          setGameStatus({
            isOver: true,
            winner: playerColor,
            reason: 'surrender',
            inCheck: false
          })
          haptics.fallen()
        } else if (msg.type === 'TIMEOUT') {
          setGameStatus({
            isOver: true,
            winner: playerColor,
            reason: 'timeout',
            inCheck: false
          })
          haptics.fallen()
        }
      }
    })

    const params = new URLSearchParams(window.location.search)
    const urlRoom = params.get('room')
    if (urlRoom) {
      setGameMode('online')
      peerService.joinRoom(urlRoom)
    }

    return () => {
      peerService.cleanup()
    }
  }, [chess, applyMove, playerColor, timeControl, updateGameState])

  // Host: Create Arena
  const handleCreateRoom = () => {
    setGameMode('online')
    setClocks({ w: timeControl, b: timeControl })
    const code = peerService.createRoom()
    setRoomCode(code)
  }

  // Cancel Room & return to menu
  const handleCancelRoom = () => {
    peerService.cleanup()
    setRoomCode(null)
    setConnectionState('idle')
    setConnectionStatus('')
  }

  // Guest: Join Arena
  const handleJoinRoom = (code: string) => {
    setGameMode('online')
    setRoomCode(code.toUpperCase())
    peerService.joinRoom(code)
  }

  // CPU Game (uses configured settings)
  const handleStartCpu = () => {
    hasRecordedStats.current = false
    isCpuThinking.current = false
    setGameMode('cpu')
    setPlayerColor(cpuPlayerColor)
    setIsFlipped(cpuPlayerColor === 'b')
    setClocks({ w: timeControl, b: timeControl })
    chess.reset()
    setLastMove(null)
    setSelectedSquare(null)
    setValidMoves([])
    updateGameState()
    setView('game')
  }

  // Local Pass & Play
  const handleStartLocal = () => {
    hasRecordedStats.current = false
    setGameMode('local')
    setPlayerColor('w')
    setIsFlipped(false)
    setClocks({ w: timeControl, b: timeControl })
    chess.reset()
    setLastMove(null)
    setSelectedSquare(null)
    setValidMoves([])
    updateGameState()
    setView('game')
  }

  // Reset / Rematch
  const handleRestart = () => {
    hasRecordedStats.current = false
    isCpuThinking.current = false
    chess.reset()
    setLastMove(null)
    setSelectedSquare(null)
    setValidMoves([])
    setClocks({ w: timeControl, b: timeControl })
    updateGameState()

    if (gameMode === 'online') {
      peerService.sendMessage({ type: 'RESTART' })
    }
  }

  // Return to Lobby
  const handleExit = () => {
    hasRecordedStats.current = false
    isCpuThinking.current = false
    peerService.cleanup()
    setRoomCode(null)
    setConnectionState('idle')
    chess.reset()
    setLastMove(null)
    setSelectedSquare(null)
    setValidMoves([])
    setView('lobby')
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  // Surrender
  const handleSurrender = () => {
    if (gameStatus.isOver) return
    const opponent = playerColor === 'w' ? 'b' : 'w'
    setGameStatus({
      isOver: true,
      winner: opponent,
      reason: 'surrender',
      inCheck: false
    })
    haptics.fallen()

    if (gameMode === 'online') {
      peerService.sendMessage({ type: 'SURRENDER' })
    }
  }

  // Board Square Click logic
  const handleSquareClick = (square: Square) => {
    if (gameStatus.isOver || isCpuThinking.current) return

    const turn = chess.turn()
    const isMyTurn = gameMode === 'local' || turn === playerColor

    if (!isMyTurn) return

    if (selectedSquare) {
      const isTargetMove = validMoves.find((m) => m.to === square)

      if (isTargetMove) {
        const piece = chess.get(selectedSquare)
        const isPawnPromotion =
          piece?.type === 'p' && ((piece.color === 'w' && square[1] === '8') || (piece.color === 'b' && square[1] === '1'))

        if (isPawnPromotion) {
          setPendingPromotion({ from: selectedSquare, to: square })
          return
        }

        const success = applyMove(selectedSquare, square)
        if (success && gameMode === 'online') {
          peerService.sendMessage({
            type: 'MOVE',
            move: { from: selectedSquare, to: square },
            timeRemaining: clocks
          })
        }
        return
      }
    }

    const piece = chess.get(square)
    if (piece && (gameMode === 'local' ? piece.color === turn : piece.color === playerColor)) {
      setSelectedSquare(square)
      const moves = chess.moves({ square, verbose: true })
      setValidMoves(moves)
    } else {
      setSelectedSquare(null)
      setValidMoves([])
    }
  }

  // Confirm Pawn Promotion
  const handleSelectPromotion = (promotionPiece: PieceSymbol) => {
    if (!pendingPromotion) return
    const { from, to } = pendingPromotion
    setPendingPromotion(null)

    const success = applyMove(from, to, promotionPiece)
    if (success && gameMode === 'online') {
      peerService.sendMessage({
        type: 'MOVE',
        move: { from, to, promotion: promotionPiece },
        timeRemaining: clocks
      })
    }
  }

  const turn = chess.turn()
  const isMyTurn = gameMode === 'local' || turn === playerColor
  const captured = computeCapturedPieces(chess)

  const opponentColor: Color = playerColor === 'w' ? 'b' : 'w'

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col items-center justify-between p-3 select-none overflow-hidden touch-manipulation">
      {view === 'lobby' ? (
        <Lobby
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onCancelRoom={handleCancelRoom}
          onStartLocal={handleStartLocal}
          onStartCpu={handleStartCpu}
          onOpenSettings={() => setIsSettingsOpen(true)}
          timeControl={timeControl}
          cpuDifficulty={cpuDifficulty}
          cpuPlayerColor={cpuPlayerColor}
          roomCode={roomCode}
          connectionStatus={connectionStatus}
          isWaiting={connectionState === 'waiting'}
        />
      ) : (
        <div className="w-full flex-1 flex flex-col items-center justify-between max-w-md py-1">
          {/* Header & Opponent Info */}
          <GameHeader
            mode={gameMode}
            playerColor={playerColor}
            currentTurn={turn}
            isMyTurn={isMyTurn}
            roomCode={roomCode || undefined}
            difficulty={cpuDifficulty}
            timeRemaining={timeControl > 0 ? clocks[opponentColor] : undefined}
            capturedByOpponent={playerColor === 'w' ? captured.w : captured.b}
            capturedByMe={playerColor === 'w' ? captured.b : captured.w}
            onRotateBoard={() => setIsFlipped((prev) => !prev)}
            onSurrender={handleSurrender}
            onExit={handleExit}
          />

          {/* Chess Board */}
          <Board
            chess={chess}
            isFlipped={isFlipped}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            lastMove={lastMove}
            onSquareClick={handleSquareClick}
          />

          {/* Move History Strip */}
          <MoveHistory history={chess.history()} />

          {/* Footer & Self Info */}
          <GameFooter
            mode={gameMode}
            playerColor={playerColor}
            isMyTurn={isMyTurn}
            inCheck={gameStatus.inCheck}
            timeRemaining={timeControl > 0 ? clocks[playerColor] : undefined}
            capturedByMe={playerColor === 'w' ? captured.b : captured.w}
          />

          {/* Promotion Modal */}
          {pendingPromotion && (
            <PromotionModal
              color={chess.turn()}
              onSelect={handleSelectPromotion}
              onCancel={() => setPendingPromotion(null)}
            />
          )}

          {/* Game Over Modal */}
          {gameStatus.isOver && (
            <GameOverModal
              winner={gameStatus.winner}
              reason={gameStatus.reason}
              playerColor={playerColor}
              isOnline={gameMode !== 'local'}
              onRestart={handleRestart}
              onExit={handleExit}
            />
          )}
        </div>
      )}

      {/* Dedicated Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        timeControl={timeControl}
        onSelectTimeControl={handleSelectTimeControl}
        cpuDifficulty={cpuDifficulty}
        onSelectCpuDifficulty={handleSelectCpuDifficulty}
        cpuPlayerColor={cpuPlayerColor}
        onSelectCpuPlayerColor={handleSelectCpuPlayerColor}
        onResetStats={() => resetPlayerStats()}
      />
    </div>
  )
}

export default App
