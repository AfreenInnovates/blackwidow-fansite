import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"

export function TargetGame() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })

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
    moveTarget()
  }

  const moveTarget = () => {
    const newX = Math.random() * 90
    const newY = Math.random() * 80
    setPosition({ x: newX, y: newY })
  }

  const handleClick = () => {
    if (!isPlaying) return
    setScore((prev) => prev + 1)
    moveTarget()
  }

  if (time === 0 && isPlaying) {
    setIsPlaying(false)
  }

  return (
    <Card className="backdrop-blur-sm bg-black/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-red-500">
          Target Practice
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

        {isPlaying && (
          <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
            <button
              onClick={handleClick}
              style={{
                position: "absolute",
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <Target className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}