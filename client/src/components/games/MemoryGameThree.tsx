import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/animations/Confetti"
import { MemoryItem, MemoryItemType } from "./memory/MemoryItems"

const MEMORY_ITEMS: MemoryItemType[] = [
  'shield',
  'target',
  'lightning',
  'radio',
  'camera',
  'key',
  'lock',
  'map'
]

interface Card3D {
  id: number
  type: MemoryItemType
  isFlipped: boolean
  isMatched: boolean
  position: [number, number, number]
}

export function MemoryGameThree() {
  const [cards, setCards] = useState<Card3D[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const createCards = () => {
    const positions: [number, number, number][] = []
    const grid = 4
    const spacing = 2.5 // Increased spacing between cards

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        positions.push([
          (i - grid/2 + 0.5) * spacing,
          0,
          (j - grid/2 + 0.5) * spacing
        ])
      }
    }

    const shuffledItems = [...MEMORY_ITEMS, ...MEMORY_ITEMS]
      .sort(() => Math.random() - 0.5)
      .map((type, index) => ({
        id: index,
        type,
        isFlipped: false,
        isMatched: false,
        position: positions[index]
      }))

    return shuffledItems
  }

  const initializeGame = () => {
    setCards(createCards())
    setFlippedCards([])
    setMatches(0)
    setMoves(0)
    setIsPlaying(true)
    setShowConfetti(false)
  }

  const handleCardClick = (id: number) => {
    if (!isPlaying || flippedCards.length === 2 || cards[id].isMatched || cards[id].isFlipped) return

    const newCards = [...cards]
    newCards[id].isFlipped = true
    setCards(newCards)
    setFlippedCards([...flippedCards, id])
  }

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1)
      const [first, second] = flippedCards

      if (cards[first].type === cards[second].type) {
        const newCards = [...cards]
        newCards[first].isMatched = true
        newCards[second].isMatched = true
        setCards(newCards)
        setMatches(prev => prev + 1)
        setFlippedCards([])
      } else {
        setTimeout(() => {
          const newCards = [...cards]
          newCards[first].isFlipped = false
          newCards[second].isFlipped = false
          setCards(newCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [flippedCards, cards])

  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (matches === MEMORY_ITEMS.length && isPlaying) {
      setIsPlaying(false)
      setShowConfetti(true) // Only show confetti when all matches are found
    }
  }, [matches, isPlaying])

  return (
    <Card className="backdrop-blur-sm bg-black/10">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-red-500">
          3D Memory Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-lg mb-2">Matches: {matches}</div>
          <div className="text-lg mb-4">Moves: {moves}</div>
          <Button
            onClick={initializeGame}
            className="bg-red-500 hover:bg-red-600 mb-4"
          >
            {isPlaying ? "Restart Game" : "Start Game"}
          </Button>
        </div>

        <div className="h-[600px] rounded-lg overflow-hidden"> {/* Increased height */}
          <Canvas camera={{ position: [0, 12, 12], fov: 50 }}> {/* Adjusted camera position */}
            <ambientLight intensity={0.8} /> {/* Increased light intensity */}
            <pointLight position={[10, 10, 10]} intensity={1.5} /> {/* Added stronger point light */}
            <OrbitControls enableZoom={false} />

            {/* Grid helper */}
            <gridHelper args={[20, 20]} />

            {isPlaying && cards.map((card) => (
              <group key={card.id} onClick={() => handleCardClick(card.id)}>
                {(card.isFlipped || card.isMatched) ? (
                  <MemoryItem type={card.type} position={card.position} />
                ) : (
                  <mesh
                    position={[card.position[0], card.position[1], card.position[2]]}
                    rotation={[0, 0, 0]}
                    scale={[1.5, 1.5, 0.2]} // Increased card size
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'default'}
                  >
                    <boxGeometry />
                    <meshStandardMaterial color="#374151" emissive="#1f2937" emissiveIntensity={0.2} />
                  </mesh>
                )}
              </group>
            ))}
          </Canvas>
        </div>
      </CardContent>
    </Card>
  )
}

export default MemoryGameThree