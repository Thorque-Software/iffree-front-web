"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") router.replace("/admin");
    if (user.role === "provider" || user.role === "providerBoat") {
      router.replace("/provider");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
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
          <Image src="/logo_iffree.png" alt="Logo" width={40} height={40} className="h-full ml-4"/>
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
