"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useRoleGuard(allowedRole: "admin" | "provider" | "providerBoat") {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    if (user.role !== allowedRole) {
      router.replace("/not-found")
    }
  }, [user, allowedRole, router])
}