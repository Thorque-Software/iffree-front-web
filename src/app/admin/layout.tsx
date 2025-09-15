import React, { ReactNode } from "react";
import { ClipboardIcon, BriefcaseIcon, CheckCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const sidebarItems = [
    { label: "Dashboard", href: "/admin", icon: <ClipboardIcon className="w-6 h-6" /> },
    { label: "Servicios", href: "/admin/services", icon: <BriefcaseIcon className="w-6 h-6" /> },
    { label: "Reservas", href: "/admin/reservations", icon: <CheckCircleIcon className="w-6 h-6" /> },
    { label: "Proveedores", href: "/admin/providers", icon: <UserGroupIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
