"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white border-b-4 border-[#3b82f6]">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 cursor-pointer group">
          <img src="/loenbro-logo.png" alt="Loenbro Logo" className="h-10 w-auto object-contain" />
          <div className="flex flex-col items-start justify-center">
             <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-tight">Loenbro</span>
             <span className="font-medium text-xs text-slate-500 tracking-widest uppercase">Prefabrication</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-[#3b82f6] hover:bg-slate-50 px-4 py-2 rounded-md transition-all text-center min-w-[90px]">Dashboard</Link>
            <Link href="/admin" className="text-sm font-semibold text-slate-600 hover:text-[#ef4444] hover:bg-red-50 px-4 py-2 rounded-md transition-all text-center min-w-[90px] border border-transparent hover:border-red-200">Administration</Link>
        </nav>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* User Profile */}
        <div className="hidden md:flex items-center gap-5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 border-2 border-white shadow-sm ring-2 ring-slate-100 overflow-hidden cursor-pointer">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mario" alt="User Profile" />
            </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <nav className="md:hidden flex flex-col items-center bg-white shadow-lg w-full absolute top-16 left-0 py-4 gap-4 z-50">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-slate-600">Dashboard</Link>
            <Link href="/admin" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-[#ef4444]">Administration</Link>
        </nav>
      )}
    </header>
  );
}
