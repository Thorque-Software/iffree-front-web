'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch, ApiResponse } from '@/lib/fetcher'
import type { User, Credentials, AuthResponse } from '@/types/api'

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (creds: Credentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (creds: Credentials) => {
    const res = await apiFetch<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(creds),
    })
    if (!res.success || !res.data) throw new Error(res.error || 'Login failed')

    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const logout = async () => {
    await apiFetch('/users/logout', { method: 'POST' })
    localStorage.removeItem('token')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await apiFetch<User>('/auth/me')
      if (res.success && res.data) {
        setUser(res.data)
      } else {
        setUser(null)
      }
    } catch (e) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
