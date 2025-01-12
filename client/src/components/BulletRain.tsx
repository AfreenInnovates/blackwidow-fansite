import { useEffect, useRef } from 'react'

export function BulletRain() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let bullets: HTMLDivElement[] = []

    const createBullet = () => {
      const bullet = document.createElement('div')
      bullet.className = 'bullet-animation'
      bullet.style.left = `${Math.random() * 100}%`
      bullet.style.animationDelay = `${Math.random() * 2}s`
      bullet.style.width = `${2 + Math.random() * 2}px`
      bullet.style.height = `${8 + Math.random() * 4}px`
      bullet.style.opacity = '0.8'
      container.appendChild(bullet)
      bullets.push(bullet)

      bullet.addEventListener('animationend', () => {
        bullet.remove()
        bullets = bullets.filter(b => b !== bullet)
      })
    }

    const interval = setInterval(() => {
      if (bullets.length < 40) {
        createBullet()
      }
    }, 40)

    return () => {
      clearInterval(interval)
      bullets.forEach(bullet => bullet.remove())
    }
  }, [])

  return <div ref={containerRef} className="bullet-container" />
}