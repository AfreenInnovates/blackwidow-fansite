import { useCallback } from "react"
import Particles from "react-particles"
import type { Engine } from "tsparticles-engine"
import { loadFull } from "tsparticles"

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1
        },
        background: {
          opacity: 0
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: "#ff0000"
          },
          links: {
            color: "#ff0000",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "bounce"
            },
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          },
          number: {
            value: 80,
            density: {
              enable: true,
              area: 800
            }
          },
          opacity: {
            value: {
              min: 0.1,
              max: 0.5
            },
            animation: {
              enable: true,
              speed: 1,
              sync: false
            }
          },
          shape: {
            type: "circle"
          },
          size: {
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 2,
              sync: false
            }
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse"
              },
              onClick: {
                enable: true,
                mode: "push"
              }
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4
              },
              push: {
                quantity: 4
              }
            }
          }
        },
        detectRetina: true
      }}
    />
  )
}