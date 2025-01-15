import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Footer } from "./Footer"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

export function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/30 to-black">
      <div className="fixed inset-0 bg-[url('/black-widow-pattern.png')] opacity-5 pointer-events-none animated-gradient" />
      <Header />
      <div className="flex h-screen pt-16">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            collapsible={true}
            minSize={5}
            maxSize={30}
            collapsedSize={5}
            onCollapse={() => setIsCollapsed(true)}
            onExpand={() => setIsCollapsed(false)}
            className={cn(
              "relative z-10 transition-all duration-300 ease-in-out",
              isCollapsed ? "min-w-[50px]" : "min-w-[200px]"
            )}
          >
            <Sidebar collapsed={isCollapsed} />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-[45vh] -mr-3 h-6 w-6 rounded-full border bg-background hover:bg-red-500/20"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </ResizablePanel>
          <ResizableHandle className="w-2 bg-border hover:bg-red-500/20 transition-colors" />
          <ResizablePanel defaultSize={80} minSize={30}>
            <main className="h-[calc(100vh-4rem)] overflow-y-auto px-6 py-8">
              <div className="mx-auto max-w-7xl pb-20">
                <Outlet />
              </div>
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Footer />
    </div>
  )
}