"use client";

import React, { ReactNode } from "react";
import { ClipboardIcon, BriefcaseIcon, CheckCircleIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/hooks/useRoleGuard";

interface ProviderLayoutProps {
  children: ReactNode;
}

const ProviderLayout: React.FC<ProviderLayoutProps> = ({ children }) => {
  useRoleGuard("provider");
  const sidebarItems = [
    { label: "Dashboard", href: "/provider", icon: <ClipboardIcon className="w-6 h-6" /> },
    { label: "Perfil", href: "/provider/profile", icon: <UserIcon className="w-6 h-6" /> },
    { label: "Servicios", href: "/provider/services", icon: <BriefcaseIcon className="w-6 h-6" /> },
    { label: "Reservas", href: "/provider/reservations", icon: <CheckCircleIcon className="w-6 h-6" /> },
    { label: "Calendario", href: "/provider/calendar", icon: <CalendarIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default ProviderLayout;
