import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

const GRID_SIZE = 10
const INITIAL_TIME = 30
const NUM_GUARDS = 3

export function StealthGame() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(INITIAL_TIME)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [guards, setGuards] = useState<Array<{ x: number; y: number }>>([])
  const [objective] = useState({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 })
  const [showGameOver, setShowGameOver] = useState(false)
  const [gameResult, setGameResult] = useState({ message: "", score: 0 })

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0))
        moveGuards()
      }, 300) // Faster guard movement for more challenge
    }
    return () => clearInterval(timer)
  }, [isPlaying, time])

  const startGame = () => {
    setScore(0)
    setTime(INITIAL_TIME)
    setIsPlaying(true)
    setPlayerPosition({ x: 0, y: 0 })
    setShowGameOver(false)
    initializeGuards()
  }

  const initializeGuards = () => {
    // Place guards strategically around the middle of the field
    const newGuards = [
      { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
      { x: Math.floor(GRID_SIZE / 3), y: Math.floor(GRID_SIZE / 3) },
      { x: Math.floor(GRID_SIZE * 2 / 3), y: Math.floor(GRID_SIZE * 2 / 3) }
    ]
    setGuards(newGuards)
  }

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isPlaying) return

    setPlayerPosition(prev => {
      const newPos = { ...prev }
      switch (direction) {
        case 'up':
          if (prev.y > 0) newPos.y = prev.y - 1
          break
        case 'down':
          if (prev.y < GRID_SIZE - 1) newPos.y = prev.y + 1
          break
        case 'left':
          if (prev.x > 0) newPos.x = prev.x - 1
          break
        case 'right':
          if (prev.x < GRID_SIZE - 1) newPos.x = prev.x + 1
          break
      }
      return newPos
    })

    checkCollisions()
  }

  const moveGuards = () => {
    if (!isPlaying) return

    setGuards(prev => prev.map(guard => {
      // Guards now actively chase the player
      const dx = playerPosition.x - guard.x
      const dy = playerPosition.y - guard.y
      
      // Calculate new position moving towards player
      let newX = guard.x
      let newY = guard.y

      // Move guard towards player with some randomness
      if (Math.random() > 0.3) { // 70% chance to move towards player
        if (Math.abs(dx) > Math.abs(dy)) {
          newX += Math.sign(dx)
        } else {
          newY += Math.sign(dy)
        }
      } else { // 30% chance to move randomly
        const randomMove = Math.floor(Math.random() * 4)
        switch (randomMove) {
          case 0: newX += 1; break
          case 1: newX -= 1; break
          case 2: newY += 1; break
          case 3: newY -= 1; break
        }
      }

      // Keep guards within bounds
      newX = Math.max(0, Math.min(newX, GRID_SIZE - 1))
      newY = Math.max(0, Math.min(newY, GRID_SIZE - 1))

      return { x: newX, y: newY }
    }))

    checkCollisions()
  }

  const checkCollisions = () => {
    // Check if player is caught by any guard
    const caught = guards.some(guard => {
      const dx = Math.abs(guard.x - playerPosition.x)
      const dy = Math.abs(guard.y - playerPosition.y)
      return dx === 0 && dy === 0
    })

    if (caught) {
      setIsPlaying(false)
      setGameResult({ message: "Caught by guards!", score })
      setShowGameOver(true)
      return
    }

    // Check if player reached objective
    if (playerPosition.x === objective.x && playerPosition.y === objective.y) {
      const timeBonus = time * 10
      const finalScore = score + timeBonus + 100
      setScore(finalScore)
      setGameResult({ message: "Mission Complete!", score: finalScore })
      setShowGameOver(true)
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          movePlayer('up')
          break
        case 'ArrowDown':
        case 's':
          movePlayer('down')
          break
        case 'ArrowLeft':
        case 'a':
          movePlayer('left')
          break
        case 'ArrowRight':
        case 'd':
          movePlayer('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying, playerPosition])

  if (time === 0 && isPlaying) {
    setIsPlaying(false)
    setGameResult({ message: "Time's up!", score })
    setShowGameOver(true)
  }

  return (
    <Card className="backdrop-blur-sm bg-black/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-red-500">
          Stealth Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-lg mb-2">Score: {score}</div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">Time:</span>
            <Progress value={(time / INITIAL_TIME) * 100} className="w-[60%]" />
            <span className="text-lg">{time}s</span>
          </div>
          <p className="mb-4 text-gray-400">
            Use WASD or arrow keys to move. Reach the green EXIT while avoiding the yellow guards.
            <br />
            You start from the top-left corner. Be quick for bonus points!
          </p>
          <Button
            onClick={startGame}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPlaying ? "Restart Mission" : "Start Mission"}
          </Button>
        </div>

        <div className="grid grid-cols-10 gap-1 w-full max-w-[600px] mx-auto bg-black/40 p-4 rounded-lg border border-red-500/20">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE
            const y = Math.floor(index / GRID_SIZE)
            const isPlayer = playerPosition.x === x && playerPosition.y === y
            const isGuard = guards.some(g => g.x === x && g.y === y)
            const isObjective = objective.x === x && objective.y === y

            return (
              <div
                key={index}
                className={`
                  aspect-square rounded-sm flex items-center justify-center
                  ${isPlayer ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                    isGuard ? 'bg-yellow-500 shadow-md shadow-yellow-500/50' :
                    isObjective ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse ring-2 ring-emerald-400' :
                    'bg-gray-800/50 hover:bg-gray-700/50'}
                  transition-all duration-200 border border-white/5 min-h-[40px]
                `}
              >
                {isPlayer && <User className="w-5 h-5 text-white drop-shadow-glow" />}
                {isGuard && <X className="w-5 h-5 text-white drop-shadow-glow" />}
                {isObjective && <div className="text-xs text-white font-bold drop-shadow-glow">EXIT</div>}
              </div>
            )
          })}
        </div>
      </CardContent>

      <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>{gameResult.message}</DialogTitle>
            <DialogDescription>
              Final Score: {gameResult.score}
              {gameResult.message === "Mission Complete!" && (
                <>
                  <br />
                  Time Bonus: +{time * 10} points
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4">
            <Button onClick={startGame} className="bg-red-500 hover:bg-red-600">
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}