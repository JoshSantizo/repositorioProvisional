"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getUserSession, clearUserSession } from "@/lib/auth"
import { getMenuItemsForRole, MenuItem } from "@/lib/menu-items"

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      // Sincronización con los campos del backend: nombre y rol
      setUserName((prev) => (prev !== user.nombre ? user.nombre : prev));
      setMenuItems(getMenuItemsForRole(user.rol));
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    clearUserSession()
    router.push("/")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-sidebar-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-semibold text-sidebar-foreground">Dashboard</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h8" />
            )}
          </svg>
        </Button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}

      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "fixed lg:sticky top-0 inset-y-0 left-0 z-40 lg:h-screen max-h-screen",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full pt-20 lg:pt-0">
          {/* Header - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex items-center justify-between p-4 border-b border-sidebar-border flex-shrink-0">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-sidebar-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-sidebar-foreground">Dashboard</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <svg
                className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </Button>
          </div>

          {/* User info */}
          {!collapsed && userName && (
            <div className="p-4 border-b border-sidebar-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">Bienvenido</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                      collapsed && "justify-center",
                    )}
                  >
                    {item.icon}
                    {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border flex-shrink-0">
            <button onClick={handleLogout} className="w-full">
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center",
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {!collapsed && <span className="font-medium text-sm">Salir</span>}
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}