"use client";

import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      // acá podés redirigir si querés
      // router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error en login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-cyan-400 p-4 h-20 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo circular de ejemplo */}
          <div className="w-10 h-10 bg-cyan-700 rounded-full" />
        </div>
      </header>

      {/* Contenido central */}
      <main className="flex-grow flex flex-col items-center justify-center bg-white">
        <div className="flex flex-row items-center mb-6">
            <UserIcon className="h-15 w-15 " />
            <h1 className="text-lg font-medium mt-2">Iniciar sesión</h1>
          </div>
        <div className="w-full max-w-sm bg-white shadow rounded border border-gray-300 p-6">
          {loading ? <p className="text-blue-500">Cargando...</p> : 
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full bg-white rounded-md border border-gray-300 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                className="w-full bg-white rounded-md border border-gray-300 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 rounded"
            >
              Ingresar
            </button>
          </form>
          }

          {/* Links */}
          <div className="flex justify-between mt-4 text-sm">
            {error && <p className="text-red-500">{error}</p>}
            <a href="#" className="text-cyan-700 underline hover:text-cyan-500">
              Olvidé mi contraseña
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-cyan-400 h-20"></footer>
    </div>
  );
}
