import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Box } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/animations/Confetti"
import { Progress } from "@/components/ui/progress"

const GAME_SIZE = 4
const INITIAL_TIME = 60

const Target = ({ position, onClick }: { position: [number, number, number], onClick: () => void }) => (
  <Box
    position={position}
    scale={[0.8, 0.8, 0.8]}
    onClick={onClick}
    onPointerOver={() => document.body.style.cursor = 'pointer'}
    onPointerOut={() => document.body.style.cursor = 'default'}
  >
    <meshStandardMaterial color="#ef4444" />
  </Box>
)

export function ReflexGameThree() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(INITIAL_TIME)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTarget, setActiveTarget] = useState<[number, number, number]>([0, 0, 0])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, time])

  const startGame = () => {
    setScore(0)
    setTime(INITIAL_TIME)
    setIsPlaying(true)
    setShowConfetti(false)
    moveTarget()
  }

  const moveTarget = () => {
    const x = (Math.random() - 0.5) * 8
    const y = (Math.random() - 0.5) * 8
    const z = (Math.random() - 0.5) * 8
    setActiveTarget([x, y, z])
  }

  const handleClick = () => {
    if (!isPlaying) return
    setScore((prev) => prev + 1)
    moveTarget()
  }

  if (time === 0 && isPlaying) {
    setIsPlaying(false)
  }

  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (time === 0 && isPlaying) {
      setIsPlaying(false)
      if (score > 20) { // Show confetti only for winning scores
        setShowConfetti(true)
      }
    }
  }, [time, isPlaying, score])

  return (
    <Card className="backdrop-blur-sm bg-black/10">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-red-500">
          3D Reflex Training
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
          {!isPlaying && (
            <Button onClick={startGame} className="bg-red-500 hover:bg-red-600">
              Start Game
            </Button>
          )}
        </div>

        <div className="h-[400px] rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enableZoom={false} />

            {/* Grid helper */}
            <gridHelper args={[20, 20]} />

            {isPlaying && (
              <Target position={activeTarget} onClick={handleClick} />
            )}
          </Canvas>
        </div>
      </CardContent>
    </Card>
  )
}