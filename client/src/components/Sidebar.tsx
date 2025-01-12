import { Link, useLocation } from "react-router-dom"
import { Home, Gamepad2, Brain, Image, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Games", href: "/games", icon: Gamepad2 },
  { name: "Trivia", href: "/trivia", icon: Brain },
  { name: "Gallery", href: "/gallery", icon: Image },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Community", href: "/community", icon: Users },
]

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation()

  return (
    <div className="h-full">
      <div className="flex h-full grow flex-col gap-y-5 overflow-y-auto border-r bg-black/10 backdrop-blur-xl px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className={cn(
              "transition-all duration-300",
              collapsed ? "w-6" : "w-auto h-8"
            )}
            src="/black-widow-logo.svg"
            alt="Black Widow"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        location.pathname === item.href
                          ? "bg-red-500/10 text-red-500"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-500/10",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200"
                      )}
                    >
                      <item.icon className={cn(
                        "h-6 w-6 shrink-0",
                        collapsed ? "mx-auto" : ""
                      )} />
                      {!collapsed && item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}