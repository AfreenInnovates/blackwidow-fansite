import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getGames } from "@/api/content"
import { ReflexGameThree } from "@/components/games/ReflexGameThree"
import { MemoryGameThree } from "@/components/games/MemoryGameThree"
import { TargetGameThree } from "@/components/games/TargetGameThree"
import { StealthGameThree } from "@/components/games/StealthGameThree"
import { useToast } from "@/hooks/useToast"

interface Game {
  id: string
  title: string
  description: string
}

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  stealth: StealthGameThree,
  reflex: ReflexGameThree,
  memory: MemoryGameThree,
  target: TargetGameThree,
}

export function Games() {
  const [games, setGames] = useState<Game[]>([])
  const [activeGame, setActiveGame] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getGames()
        setGames(data.games)
        setActiveGame(data.games[0].id)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load games"
        })
      }
    }
    fetchGames()
  }, [toast])

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl font-bold text-red-500">Training Games</h1>

      <Tabs value={activeGame} onValueChange={setActiveGame}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${games.length}, minmax(0, 1fr))` }}>
          {games.map((game) => (
            <TabsTrigger key={game.id} value={game.id} className="text-sm">
              {game.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {games.map((game) => {
          const GameComponent = GAME_COMPONENTS[game.id]
          return (
            <TabsContent key={game.id} value={game.id}>
              <div className="grid gap-6">
                <Card className="backdrop-blur-sm bg-black/10">
                  <CardHeader>
                    <CardTitle>{game.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{game.description}</p>
                  </CardContent>
                </Card>

                {GameComponent && <GameComponent />}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}