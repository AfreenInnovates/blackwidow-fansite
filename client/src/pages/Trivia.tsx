import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getTriviaQuestions } from "@/api/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/useToast";
import { Confetti } from "@/components/animations/Confetti";
import { TextReveal } from "@/components/animations/TextReveal";
import { TriviaQuestion, TriviaLifelines } from "@/api/models";

const QUESTION_TIME = 30;
const EXTRA_TIME = 10;

export function Trivia() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const [showConfetti, setShowConfetti] = useState(false);
  const [lifelines, setLifelines] = useState<TriviaLifelines>({
    fiftyFifty: true,
    skip: true,
    aiHelp: true,
    extraTime: true,
  });
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getTriviaQuestions();
        setQuestions(data.questions);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load questions",
        });
      }
    };
    fetchQuestions();
  }, [toast]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, showResults]);

  const handleTimeout = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    toast({
      variant: "destructive",
      title: "Time's up!",
      description: `The correct answer was: ${
        questions[currentQuestion].options[
          questions[currentQuestion].correctAnswer
        ]
      }`,
    });
    nextQuestion();
  };

  const handleAnswer = (selectedIndex: number) => {
    setSelectedOption(selectedIndex);
    if (questions[currentQuestion].correctAnswer === selectedIndex) {
      setScore(score + 1);
      setShowConfetti(true);
      toast({
        title: "Correct!",
        className: "bg-green-500",
        description: questions[currentQuestion].explanation,
      });
    } else {
      toast({
        title: "Wrong!",
        variant: "destructive",
        description: questions[currentQuestion].explanation,
      });
    }

    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    setSelectedOption(undefined);
    setShowConfetti(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(QUESTION_TIME);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setTimeLeft(QUESTION_TIME);
    setLifelines({
      fiftyFifty: true,
      skip: true,
      aiHelp: true,
      extraTime: true,
    });
    setShowConfetti(false);
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty) return;

    const correctAnswer = questions[currentQuestion].correctAnswer;
    let optionsToRemove = questions[currentQuestion].options
      .map((_, index) => index)
      .filter((index) => index !== correctAnswer);

    // Randomly remove 2 wrong answers
    optionsToRemove = optionsToRemove
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const newOptions = questions[currentQuestion].options.map((option, index) =>
      optionsToRemove.includes(index) ? "" : option
    );

    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = {
        ...updated[currentQuestion],
        options: newOptions,
      };
      return updated;
    });

    setLifelines((prev) => ({ ...prev, fiftyFifty: false }));
  };

  const useSkip = () => {
    if (!lifelines.skip) return;
    setLifelines((prev) => ({ ...prev, skip: false }));
    nextQuestion();
  };

  const useAiHelp = () => {
    if (!lifelines.aiHelp) return;
    toast({
      title: "AI Hint",
      description:
        "Think about Black Widow's background and her role in the Avengers...",
    });
    setLifelines((prev) => ({ ...prev, aiHelp: false }));
  };

  const useExtraTime = () => {
    if (!lifelines.extraTime) return;
    setTimeLeft((prev) => prev + EXTRA_TIME);
    setLifelines((prev) => ({ ...prev, extraTime: false }));
  };

  if (!questions.length) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="backdrop-blur-sm bg-black/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-500">
            <TextReveal text="Black Widow Trivia Challenge" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showResults ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">Quiz Complete!</h2>
              <p className="text-lg">
                Your Score: {score} out of {questions.length}
              </p>
              <Button
                onClick={restartQuiz}
                className="bg-red-500 hover:bg-red-600"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">Time:</span>
                  <Progress
                    value={(timeLeft / QUESTION_TIME) * 100}
                    className="w-[200px]"
                  />
                  <span className="text-lg">{timeLeft}s</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Button
                  onClick={useFiftyFifty}
                  disabled={!lifelines.fiftyFifty}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                >
                  50:50
                </Button>
                <Button
                  onClick={useSkip}
                  disabled={!lifelines.skip}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
                >
                  Skip
                </Button>
                <Button
                  onClick={useAiHelp}
                  disabled={!lifelines.aiHelp}
                  className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
                >
                  AI Help
                </Button>
                <Button
                  onClick={useExtraTime}
                  disabled={!lifelines.extraTime}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                >
                  +10s
                </Button>
              </div>

              <div className="space-y-6">
                <div className="text-2xl font-bold text-white bg-black/40 p-6 rounded-lg backdrop-blur-sm">
                  {questions[currentQuestion].question}
                </div>

                <div className="grid gap-4">
                  {questions[currentQuestion].options.map(
                    (option, index) =>
                      option && (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className={`
                          group relative w-full p-4 text-lg font-semibold rounded-lg
                          transition-all duration-300 ease-out
                          ${
                            selectedOption === index
                              ? "bg-red-500 text-white transform translate-y-[-2px]"
                              : "bg-gray-800/80 text-white hover:bg-red-500/10"
                          }
                          backdrop-blur-sm
                          border border-transparent
                          hover:border-red-500/50
                          hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]
                          hover:translate-y-[-2px]
                          active:translate-y-[0px]
                          disabled:opacity-50 disabled:cursor-not-allowed
                          disabled:hover:translate-y-0
                          overflow-hidden
                        `}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          disabled={selectedOption !== undefined}
                        >
                          {/* Hover gradient effect */}
                          <div
                            className="
                          absolute inset-0 opacity-0 group-hover:opacity-100
                          bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0
                          transition-opacity duration-300
                          pointer-events-none
                        "
                          />

                          {/* Letter spacing effect on hover */}
                          <div
                            className="
                          relative z-10
                          transition-all duration-300
                          group-hover:tracking-wider
                        "
                          >
                            {/* Add subtle icon or indicator */}
                            <span
                              className="
                            inline-block mr-2 opacity-0 translate-x-[-10px]
                            group-hover:opacity-100 group-hover:translate-x-0
                            transition-all duration-300
                          "
                            >
                              •
                            </span>
                            {option}
                          </div>
                        </motion.button>
                      )
                  )}
                </div>
              </div>
            </div>
          )}
          {showConfetti && <Confetti />}
        </CardContent>
      </Card>
    </div>
  );
}
