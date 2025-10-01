'use client';
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="flex flex-col justify-between h-auto w-64 bg-white shadow-md p-6">
      <div>
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/iffree_logo_entero.png"
            alt="IFFREE"
            width={150}
            height={50}
            className="object-contain mb-4"
          />
        </div>

        {/* Navegación */}
        <nav className="flex flex-col w-full space-y-2 mt-4">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition
                  ${isActive ? "bg-blue-300 text-white" : "hover:bg-gray-200"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout abajo */}
      <button
        onClick={logout}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg text-black hover:bg-gray-100 transition"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
};

export default Sidebar;
