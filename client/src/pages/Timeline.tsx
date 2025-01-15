import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TextReveal } from "@/components/animations/TextReveal"
import { Confetti } from "@/components/animations/Confetti"
import { useToast } from "@/hooks/useToast"

const timelineEvents = [
  {
    year: "1984",
    title: "Born in Stalingrad",
    description: "Natasha Romanoff was born in Stalingrad (now Volgograd), Russia. Her early life was marked by the Soviet Union's strict regime and the beginning of what would become a legendary story.",
    image: "/images/timeline/birth.jpg",
    category: "Origin",
    points: 10,
    quiz: {
      question: "What was Black Widow's birth name?",
      options: ["Natalia Romanova", "Yelena Belova", "Natasha Romanoff", "Maria Hill"],
      correctAnswer: 0,
      explanation: "She was born as Natalia Romanova, later anglicized to Natasha Romanoff."
    }
  },
  {
    year: "1989",
    title: "Selected for Training",
    description: "At just five years old, Natasha was selected for the elite Black Widow program, showing exceptional potential that would shape her future.",
    image: "/images/timeline/selected.jpg",
    category: "Training",
    points: 15,
    quiz: {
      question: "How old was Natasha when she was selected for training?",
      options: ["Three", "Five", "Seven", "Ten"],
      correctAnswer: 1,
      explanation: "Natasha was chosen at age five, demonstrating remarkable abilities even then."
    }
  },
  {
    year: "1995",
    title: "Red Room Training",
    description: "The infamous Red Room Academy molded young Natasha into a formidable operative. Here she learned ballet, combat, espionage, and the art of survival.",
    image: "/images/timeline/training.jpg",
    category: "Training",
    points: 20,
    quiz: {
      question: "What was NOT taught in the Red Room?",
      options: ["Ballet", "Combat", "Cooking", "Espionage"],
      correctAnswer: 2,
      explanation: "The Red Room focused on combat, espionage, and cover skills like ballet, not domestic skills."
    }
  },
  {
    year: "2006",
    title: "Encounter with Hawkeye",
    description: "A pivotal moment came when Clint Barton (Hawkeye) was sent to eliminate her but made a different call, leading to her defection to S.H.I.E.L.D.",
    image: "/images/timeline/hawkeye.jpg",
    category: "Career",
    points: 25,
    quiz: {
      question: "Who was sent to eliminate Black Widow but spared her?",
      options: ["Nick Fury", "Hawkeye", "Iron Man", "Winter Soldier"],
      correctAnswer: 1,
      explanation: "Clint Barton (Hawkeye) chose to recruit her instead of eliminating her."
    }
  },
  {
    year: "2010",
    title: "Undercover at Stark Industries",
    description: "Infiltrated Stark Industries as Natalie Rushman, monitoring Tony Stark and proving her exceptional spy skills in her first major MCU appearance.",
    image: "/images/timeline/stark.jpg",
    category: "MCU",
    points: 30,
    quiz: {
      question: "What alias did Natasha use at Stark Industries?",
      options: ["Nancy Roman", "Natalie Rushman", "Nina Roberts", "Nicole Royce"],
      correctAnswer: 1,
      explanation: "She used the alias Natalie Rushman while working undercover at Stark Industries."
    }
  },
  {
    year: "2012",
    title: "Battle of New York",
    description: "Fought alongside the Avengers in the Battle of New York, proving herself as a key member of Earth's mightiest heroes against the Chitauri invasion.",
    image: "/images/timeline/newyork.jpg",
    category: "MCU",
    points: 35,
    quiz: {
      question: "What weapon did Black Widow acquire during the Battle of New York?",
      options: ["Chitauri Scepter", "Iron Man Suit", "Thor's Hammer", "Hawkeye's Bow"],
      correctAnswer: 0,
      explanation: "She used the Chitauri Scepter to close the portal above Stark Tower."
    }
  },
  {
    year: "2019",
    title: "The Ultimate Sacrifice",
    description: "Made the ultimate sacrifice on Vormir to obtain the Soul Stone, proving that her love for humanity and her found family knew no bounds.",
    image: "/images/timeline/sacrifice.jpg",
    category: "MCU",
    points: 40,
    quiz: {
      question: "Why did Black Widow sacrifice herself on Vormir?",
      options: ["To save Hawkeye", "To obtain the Soul Stone", "To defeat Thanos", "All of the above"],
      correctAnswer: 3,
      explanation: "Her sacrifice was multifaceted - to save Hawkeye, get the Soul Stone, and ultimately help defeat Thanos."
    }
  }
]

export function Timeline() {
  const [unlockedEvents, setUnlockedEvents] = useState<Set<string>>(new Set(["1984"]))
  const [userPoints, setUserPoints] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const { scrollYProgress } = useScroll()
  const { toast } = useToast()

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [-100, 0])

  const handleUnlock = (event: any) => {
    if (!unlockedEvents.has(event.year)) {
      setCurrentQuiz(event)
      setShowQuiz(true)
    }
  }

  const handleQuizAnswer = (answer: number) => {
    const isCorrect = currentQuiz.quiz.correctAnswer === answer
    
    // Always unlock the event
    setUnlockedEvents(new Set([...unlockedEvents, currentQuiz.year]))
    
    if (isCorrect) {
      setUserPoints(prev => prev + currentQuiz.points)
      setShowConfetti(true)
      toast({
        title: "Correct!",
        description: `${currentQuiz.quiz.explanation}\nYou earned ${currentQuiz.points} points!`,
        className: "bg-green-500",
      })
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      toast({
        title: "Incorrect",
        description: currentQuiz.quiz.explanation,
        variant: "destructive",
      })
    }
    
    setShowQuiz(false)
  }

  return (
    <div className="relative min-h-screen">
      {/* Header Section */}
      <motion.div 
        className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 mb-8"
        style={{ opacity }}
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-red-500">
            <TextReveal text="Black Widow's Journey" />
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">
              Points: {userPoints}
            </div>
            <Progress value={(unlockedEvents.size / timelineEvents.length) * 100} className="w-32" />
          </div>
        </div>
      </motion.div>

      {/* Timeline Content */}
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-transparent" />
        
        {timelineEvents.map((event, index) => (
          <motion.div
            key={event.year}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative mb-12"
          >
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-20">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${unlockedEvents.has(event.year) ? 'bg-red-500' : 'bg-gray-700'}
                    cursor-pointer transition-all duration-300
                  `}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleUnlock(event)}
                >
                  <span className="text-sm font-bold">{event.year}</span>
                </motion.div>
              </div>

              <Card className={`flex-1 backdrop-blur-sm transition-all duration-500
                ${unlockedEvents.has(event.year) 
                  ? 'bg-black/20 hover:bg-black/30' 
                  : 'bg-black/5 hover:bg-black/10'
                }
              `}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{event.title}</span>
                    <span className="text-sm text-red-500">+{event.points} pts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {unlockedEvents.has(event.year) ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <p className="text-gray-200">{event.description}</p>
                      {event.image && (
                        <img 
                          src="https://image.tmdb.org/t/p/original/e8tHXl2Pmk972K00uoPuCXsJXDO.jpg"
                          alt={event.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-center py-8">
                      <Button
                        onClick={() => handleUnlock(event)}
                        className="bg-red-500 hover:bg-red-600 transition-all duration-300
                          hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                      >
                        Unlock This Memory
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentQuiz && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Memory Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">{currentQuiz.quiz.question}</p>
              <div className="grid gap-2">
                {currentQuiz.quiz.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className="bg-gray-800 hover:bg-red-500/20 text-left justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showConfetti && <Confetti />}
    </div>
  )
}