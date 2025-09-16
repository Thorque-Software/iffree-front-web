'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '@/lib/fetcher'
import type { User, Credentials, AuthResponse, JwtPayload} from '@/types/api'
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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
  const router = useRouter()

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
    const decoded = jwtDecode<JwtPayload>(res.data.token)
    const loggedUser: User = {
      role: decoded.role,
      token: res.data.token,
      providerId: decoded.providerId ? String(decoded.providerId) : undefined,
    }
    setUser(loggedUser)
    setLoading(false)
  }


  const logout = async () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
    setLoading(false)
  }

  const refreshUser = async () => {
    const token = localStorage.getItem('token')
    if(token) {
        const decoded = jwtDecode<JwtPayload>(token)
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          logout()
        } else {
          const refreshedUser: User = {
            role: decoded.role,
            token,
            providerId: decoded.providerId ? String(decoded.providerId) : undefined,
          }
          setUser(refreshedUser)
        }
      } else {
        logout()
    }
    setLoading(false)
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
