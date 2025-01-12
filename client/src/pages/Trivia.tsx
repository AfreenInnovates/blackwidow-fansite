import { useEffect, useState } from "react"
import { getTriviaQuestions } from "@/api/content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export function Trivia() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getTriviaQuestions()
        setQuestions(data.questions)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load questions"
        })
      }
    }
    fetchQuestions()
  }, [toast])

  const handleAnswer = (selectedIndex: number) => {
    if (questions[currentQuestion].correctAnswer === selectedIndex) {
      setScore(score + 1)
      toast({
        title: "Correct!",
        className: "bg-green-500",
      })
    } else {
      toast({
        title: "Wrong!",
        variant: "destructive",
      })
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResults(false)
  }

  if (!questions.length) return null

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="backdrop-blur-sm bg-black/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-500">
            Black Widow Trivia Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showResults ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">Quiz Complete!</h2>
              <p className="text-lg">
                Your Score: {score} out of {questions.length}
              </p>
              <Button onClick={restartQuiz} className="bg-red-500 hover:bg-red-600">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-lg mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {questions[currentQuestion].question}
              </h3>
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full text-left justify-start bg-gray-700 hover:bg-gray-600"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}