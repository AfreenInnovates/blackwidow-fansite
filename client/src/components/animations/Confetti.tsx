import { useEffect, useRef } from "react"
import ConfettiJS from "confetti-js"
import { useTheme } from "@/components/ui/theme-provider"

interface ConfettiProps {
  duration?: number;
  onComplete?: () => void;
}

export function Confetti({ duration = 5000, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!canvasRef.current) return

    // Use theme-aware colors
    const isDark = theme === 'dark'
    const primaryColor = isDark ? [255, 0, 0] : [220, 0, 0]
    const secondaryColor = isDark ? [153, 0, 0] : [180, 0, 0]
    const accentColor = isDark ? [255, 255, 255] : [0, 0, 0]

    const confetti = new ConfettiJS({
      target: canvasRef.current,
      max: 150,
      size: 2,
      animate: true,
      props: ["circle", "square", "triangle", "line"],
      colors: [primaryColor, secondaryColor, accentColor],
      clock: 25,
      rotate: true,
      start_from_edge: true,
      respawn: true,
      spread: 360,
      ticks: 300,
      origin: { x: 0.5, y: 0.5 },
      scalar: 1.2,
      zIndex: 100,
      // Add 3D-like effects
      shiftX: 20,
      shiftY: 20
    })

    confetti.render()

    const timer = setTimeout(() => {
      confetti.clear()
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(timer)
      confetti.clear()
    }
  }, [duration, onComplete, theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        transform: 'translateZ(0)', // Force GPU acceleration
        perspective: '1000px'
      }}
    />
  )
}