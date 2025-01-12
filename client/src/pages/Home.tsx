import { useEffect, useState } from "react"
import { getHomeContent } from "@/api/content"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

export function Home() {
  const [content, setContent] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getHomeContent()
        setContent(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load content"
        })
      }
    }
    fetchContent()
  }, [toast])

  if (!content) return null

  return (
    <div className="space-y-8">
      <section className="relative h-[70vh] rounded-lg overflow-hidden">
        <img
          src={content.hero.image}
          alt="Black Widow"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{content.hero.title}</h1>
            <p className="text-xl text-gray-200 mb-6">{content.hero.description}</p>
            <Button size="lg" className="bg-red-500 hover:bg-red-600">
              Join Now
            </Button>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {content.sections.map((section: any, index: number) => (
          <Card key={index} className="overflow-hidden backdrop-blur-sm bg-black/10">
            <CardContent className="p-6">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
              <p className="text-gray-400">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}