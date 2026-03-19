"use client";
import { useRole } from "./RoleContext";
import { Shield, HardHat } from "lucide-react";

export function RoleSwitcher() {
    const { role, setRole } = useRole();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center bg-white/90 backdrop-blur shadow-2xl rounded-full p-1.5 border border-slate-200">
            <button
                onClick={() => setRole('Admin')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${role === 'Admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                <Shield className="w-4 h-4" /> Admin
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button
                onClick={() => setRole('Field User')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${role === 'Field User' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                <HardHat className="w-4 h-4" /> Field User
            </button>
        </div>
    );
}
