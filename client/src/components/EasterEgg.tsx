import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { AnimatePresence, motion } from "framer-motion"

const quotes = [
  "I'm always picking up after you boys.",
  "I get emails from a raccoon. Nothing sounds crazy anymore.",
  "At some point, we all have to choose between what the world wants you to be and who you are.",
  "I don't judge people on their worst mistakes.",
  "I used to have nothing. And then I got this job, this family."
]

export function EasterEgg() {
  const [isOpen, setIsOpen] = useState(false)
  const [quote, setQuote] = useState("")

  const triggerEasterEgg = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
    setIsOpen(true)
  }

  return (
    <>
      <div
        className="fixed bottom-4 right-4 w-8 h-8 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
        onClick={triggerEasterEgg}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Black Widow Says...</DialogTitle>
          </DialogHeader>
          <AnimatePresence>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-lg italic text-gray-700 dark:text-gray-300"
            >
              "{quote}"
            </motion.p>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  )
}