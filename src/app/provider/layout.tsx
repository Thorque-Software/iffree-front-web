'use client'
import { ReactNode } from 'react'
import Link from 'next/link'


export default function ProviderLayout({ children }: { children: ReactNode }) {
    return (
    <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6">
            <h1 className="text-xl font-bold mb-6 text-blue-600">IFFREE</h1>
            <nav className="flex flex-col gap-4">
                <Link href="/provider">Dashboard</Link>
                <Link href="/provider/services">Servicios</Link>
                <Link href="/provider/reservations">Reservas</Link>
                <Link href="/provider/calendar">Calendario</Link>
                <Link href="/provider/profile">Mi perfil</Link>
            </nav>
        </aside>


        {/* Main content */}
        <main className="flex-1 p-8">{children}</main>
    </div>
    )
}