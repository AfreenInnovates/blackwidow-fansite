import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const timelineEvents = [
  {
    year: "2010",
    title: "Iron Man 2",
    description: "First appearance as Natalie Rushman, undercover S.H.I.E.L.D. agent"
  },
  {
    year: "2012",
    title: "The Avengers",
    description: "Fought in the Battle of New York, becoming a founding Avenger"
  },
  {
    year: "2014",
    title: "Captain America: The Winter Soldier",
    description: "Helped expose HYDRA's infiltration of S.H.I.E.L.D."
  },
  {
    year: "2019",
    title: "Avengers: Endgame",
    description: "Made the ultimate sacrifice on Vormir to obtain the Soul Stone"
  },
  {
    year: "2021",
    title: "Black Widow",
    description: "Solo film revealing her past and family ties"
  }
]

export function Timeline() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-red-500">Black Widow's Journey</h1>
      
      <div className="relative space-y-8">
        <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-red-500" />
        
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative flex items-center gap-6">
            <div className="absolute left-0 flex items-center justify-center w-20">
              <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                <div className="w-3 h-3 bg-background rounded-full" />
              </div>
            </div>
            
            <Card className="ml-20 w-full backdrop-blur-sm bg-black/10">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{event.title}</span>
                  <span className="text-sm text-red-500">{event.year}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{event.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}