"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { login, user, loading: authLoading } = useAuth(); // suponiendo que el hook expone un loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Redirección según el rol
  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") router.replace("/admin");
    if (user.role === "provider" || user.role === "providerBoat") {
      router.replace("/provider");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || "Error en login");
    } finally {
      setSubmitting(false);
    }
  };

  // Si el hook está chequeando usuario => loading global
  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cyan-600 font-medium">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-cyan-400 p-4 h-20 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo_iffree.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-full ml-4"
          />
        </div>
      </header>

      {/* Contenido central */}
      <main className="flex-grow flex flex-col items-center justify-center bg-white">
        <div className="flex flex-row items-center mb-6">
          <UserIcon className="h-12 w-12 text-cyan-600" />
          <h1 className="text-xl font-semibold ml-2">Iniciar sesión</h1>
        </div>
        <div className="w-full max-w-sm bg-white shadow rounded border border-gray-300 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full bg-white rounded-md border border-gray-300 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 rounded disabled:opacity-50"
            >
              {submitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Links y errores */}
          <div className="flex flex-col mt-4 text-sm">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <a
              href="#"
              className="text-cyan-700 underline hover:text-cyan-500 text-center"
            >
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
