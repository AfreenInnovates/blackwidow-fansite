import { motion } from "framer-motion"

export function TextReveal({ text }: { text: string }) {
  const words = text.split(" ")

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      className="flex flex-wrap gap-1"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.div>
  )
}