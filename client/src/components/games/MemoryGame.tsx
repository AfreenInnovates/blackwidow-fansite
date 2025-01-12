import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Target, 
  Zap, 
  Radio, 
  Camera, 
  Key, 
  Lock, 
  Map 
} from "lucide-react"

const ICONS = [
  Shield, Target, Zap, Radio, Camera, Key, Lock, Map
]

type CardType = {
  id: number
  icon: typeof Shield
  isFlipped: boolean
  isMatched: boolean
}

export function MemoryGame() {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const initializeGame = () => {
    const shuffledCards = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffledCards)
    setFlippedCards([])
    setMatches(0)
    setMoves(0)
    setIsPlaying(true)
  }

  const handleCardClick = (index: number) => {
    if (!isPlaying || flippedCards.length === 2 || cards[index].isMatched || cards[index].isFlipped) return

    const newCards = [...cards]
    newCards[index].isFlipped = true
    setCards(newCards)
    setFlippedCards([...flippedCards, index])
  }

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1)
      const [first, second] = flippedCards
      
      if (cards[first].icon === cards[second].icon) {
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

  return (
    <Card className="backdrop-blur-sm bg-black/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-red-500">
          Memory Mission
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

        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`
                w-full aspect-square rounded-lg transition-all duration-300
                ${card.isFlipped || card.isMatched 
                  ? "bg-red-500" 
                  : "bg-gray-700 hover:bg-gray-600"}
              `}
            >
              {(card.isFlipped || card.isMatched) && (
                <card.icon className="w-6 h-6 mx-auto text-white" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}