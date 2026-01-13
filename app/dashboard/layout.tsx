import type React from "react"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">{children}</main>
    </div>
  )
}
