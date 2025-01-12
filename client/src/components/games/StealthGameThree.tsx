import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Box, Sphere } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Confetti } from "@/components/animations/Confetti"

const GRID_SIZE = 10
const INITIAL_TIME = 30
const NUM_GUARDS = 3

interface SceneProps {
  playerPosition: { x: number; y: number }
  guards: Array<{ x: number; y: number }>
  objective: { x: number; y: number }
  isPlaying: boolean
}

const Scene = ({ playerPosition, guards, objective, isPlaying }: SceneProps) => {
  if (!isPlaying) return null

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />

      {/* Player */}
      <Sphere
        position={[playerPosition.x - GRID_SIZE / 2, 0.5, playerPosition.y - GRID_SIZE / 2]}
        args={[0.4, 32, 32]}
      >
        <meshStandardMaterial color="#ef4444" />
      </Sphere>

      {/* Guards */}
      {guards.map((guard, index) => (
        <Box
          key={index}
          position={[guard.x - GRID_SIZE / 2, 0.5, guard.y - GRID_SIZE / 2]}
          args={[0.8, 1, 0.8]}
        >
          <meshStandardMaterial color="#eab308" />
        </Box>
      ))}

      {/* Objective */}
      <Box
        position={[objective.x - GRID_SIZE / 2, 0.5, objective.y - GRID_SIZE / 2]}
        args={[1, 1, 1]}
      >
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </Box>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[GRID_SIZE, GRID_SIZE]} position={[0, 0.01, 0]} />
    </>
  )
}

export function StealthGameThree() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(INITIAL_TIME)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [guards, setGuards] = useState<Array<{ x: number; y: number }>>([])
  const [objective] = useState({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 })
  const [showGameOver, setShowGameOver] = useState(false)
  const [gameResult, setGameResult] = useState({ message: "", score: 0 })
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0))
        moveGuards()
      }, 300)
    }
    return () => clearInterval(timer)
  }, [isPlaying, time])

  const startGame = () => {
    setScore(0)
    setTime(INITIAL_TIME)
    setIsPlaying(true)
    setPlayerPosition({ x: 0, y: 0 })
    setShowGameOver(false)
    setShowConfetti(false)
    initializeGuards()
  }

  const initializeGuards = () => {
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
      const dx = playerPosition.x - guard.x
      const dy = playerPosition.y - guard.y

      let newX = guard.x
      let newY = guard.y

      if (Math.random() > 0.3) {
        if (Math.abs(dx) > Math.abs(dy)) {
          newX += Math.sign(dx)
        } else {
          newY += Math.sign(dy)
        }
      } else {
        const randomMove = Math.floor(Math.random() * 4)
        switch (randomMove) {
          case 0: newX += 1; break
          case 1: newX -= 1; break
          case 2: newY += 1; break
          case 3: newY -= 1; break
        }
      }

      newX = Math.max(0, Math.min(newX, GRID_SIZE - 1))
      newY = Math.max(0, Math.min(newY, GRID_SIZE - 1))

      return { x: newX, y: newY }
    }))

    checkCollisions()
  }

  const checkCollisions = () => {
    const caught = guards.some(guard => {
      return guard.x === playerPosition.x && guard.y === playerPosition.y
    })

    if (caught) {
      setIsPlaying(false)
      setGameResult({ message: "Caught by guards!", score })
      setShowGameOver(true)
      return
    }

    if (playerPosition.x === objective.x && playerPosition.y === objective.y) {
      const timeBonus = time * 10
      const finalScore = score + timeBonus + 100
      setScore(finalScore)
      setGameResult({ message: "Mission Complete!", score: finalScore })
      setShowGameOver(true)
      setIsPlaying(false)
      setShowConfetti(true)
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
          3D Stealth Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-lg mb-2">Score: {score}</div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">Time:</span>
            <Progress
              value={(time / INITIAL_TIME) * 100}
              className="w-[60%] h-2 bg-red-500/20"
            />
            <span className="text-lg">{time}s</span>
          </div>
          <Button
            onClick={startGame}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPlaying ? "Restart Mission" : "Start Mission"}
          </Button>
        </div>

        <div className="h-[600px] rounded-lg overflow-hidden bg-black/20">
          <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
            <Scene
              playerPosition={playerPosition}
              guards={guards}
              objective={objective}
              isPlaying={isPlaying}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2.5}
              minPolarAngle={Math.PI / 4}
            />
          </Canvas>
        </div>

        {showConfetti && <Confetti />}
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