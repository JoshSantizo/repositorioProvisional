"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserSession } from "@/lib/auth"
import { getMenuItemsForRole } from "@/lib/menu-items"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      const menuItems = getMenuItemsForRole(user.rol)
      router.push("/dashboard/miembros");
      if (menuItems.length > 0) {
        router.push(menuItems[0].href)
      }
    }
  }, [router])

  return null
}
