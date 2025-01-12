import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { Layout } from "./components/Layout"
import { BulletRain } from "./components/BulletRain"
import { ParticlesBackground } from "./components/animations/Particles"
import { EasterEgg } from "./components/EasterEgg"
import { Home } from "./pages/Home"
import { Games } from "./pages/Games"
import { Trivia } from "./pages/Trivia"
import { Gallery } from "./pages/Gallery"
import { Timeline } from "./pages/Timeline"
import { Community } from "./pages/Community"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <Router>
        <BulletRain />
        <ParticlesBackground />
        <EasterEgg />
        <AnimatePresence mode="wait">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/trivia" element={<Trivia />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/community" element={<Community />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App