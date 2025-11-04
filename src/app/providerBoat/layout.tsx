"use client";

import React, { ReactNode } from "react";
import { ClipboardIcon, IdentificationIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/hooks/useRoleGuard";

interface ProviderLayoutProps {
  children: ReactNode;
}

const ProviderLayout: React.FC<ProviderLayoutProps> = ({ children }) => {
  useRoleGuard("providerBoat");
  const sidebarItems = [
    { label: "Dashboard", href: "/providerBoat", icon: <ClipboardIcon className="w-6 h-6" /> },
    { label: "Perfil", href: "/providerBoat/profile", icon: <UserIcon className="w-6 h-6" /> },
    { label: "Mis Embarcaciones", href: "/providerBoat/boats", icon: <IdentificationIcon className="w-6 h-6" /> },
    { label: "Reservas", href: "/providerBoat/reservations", icon: <CalendarIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar fijo */}
      <div className="sticky top-0 h-screen">
        <Sidebar items={sidebarItems} />
      </div>
      {/* Contenido desplazable */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default ProviderLayout;
