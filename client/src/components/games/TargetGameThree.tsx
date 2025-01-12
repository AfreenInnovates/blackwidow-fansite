import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Box, Sphere } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/animations/Confetti"

const Target = ({ position, onClick }: { position: [number, number, number], onClick: () => void }) => {
  return (
    <Sphere
      position={position}
      args={[0.3, 32, 32]}
      onClick={onClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <meshStandardMaterial color="#ef4444" />
    </Sphere>
  )
}

export function TargetGameThree() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0])

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
    setTime(30)
    setIsPlaying(true)
    setShowConfetti(false)
    moveTarget()
  }

  const moveTarget = () => {
    const newX = (Math.random() - 0.5) * 8
    const newY = (Math.random() - 0.5) * 8
    const newZ = (Math.random() - 0.5) * 8
    setPosition([newX, newY, newZ])
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
      if (score > 15) { // Show confetti only for winning scores
        setShowConfetti(true)
      }
    }
  }, [time, isPlaying, score])

  return (
    <Card className="backdrop-blur-sm bg-black/10">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-red-500">
          3D Target Practice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-lg mb-2">Score: {score}</div>
          <div className="text-lg mb-4">Time: {time}s</div>
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
              <Target position={position} onClick={handleClick} />
            )}
          </Canvas>
        </div>
      </CardContent>
    </Card>
  )
}