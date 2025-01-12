import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const GAME_SIZE = 4
const INITIAL_TIME = 60

export function ReflexGame() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(INITIAL_TIME)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTarget, setActiveTarget] = useState<number | null>(null)

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
    setActiveTarget(Math.floor(Math.random() * (GAME_SIZE * GAME_SIZE)))
  }

  const handleClick = (index: number) => {
    if (!isPlaying || index !== activeTarget) return

    setScore((prev) => prev + 1)
    setActiveTarget(Math.floor(Math.random() * (GAME_SIZE * GAME_SIZE)))
  }

  if (time === 0 && isPlaying) {
    setIsPlaying(false)
  }

  return (
    <Card className="backdrop-blur-sm bg-black/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-red-500">
          Spy Reflexes
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

        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {Array.from({ length: GAME_SIZE * GAME_SIZE }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`
                w-full aspect-square rounded-lg transition-all duration-200
                ${index === activeTarget && isPlaying
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-700 hover:bg-gray-600"
                }
              `}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}