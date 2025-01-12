import { useEffect, useState } from "react"
import { useSpring, animated } from "@react-spring/web"

export function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [props] = useSpring(() => ({
    to: { transform: `translateY(${scrollY * 0.5}px)` },
    config: { mass: 1, tension: 280, friction: 120 }
  }))

  return (
    <animated.div
      style={props}
      className="fixed inset-0 bg-[url('/black-widow-pattern.png')] opacity-5 pointer-events-none z-0"
    />
  )
}