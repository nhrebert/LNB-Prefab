"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, HardHat, MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ToolDetails {
    id: string;
    name: string;
    category: string;
}

interface CheckOutAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (location: string, user: string) => void;
    tool: ToolDetails | null;
}

export function CheckOutAssetModal({ isOpen, onClose, onConfirm, tool }: CheckOutAssetModalProps) {
    const { data: session } = useSession();
    const [location, setLocation] = useState("Data Center Phase 1");
    // Removed arbitrary user state

    if (!tool) return null;

    const handleSubmit = () => {
        // user is ignored on the backend now, but we'll fulfill the signature
        onConfirm(location, session?.user?.name || session?.user?.email || "Unknown User");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-sm">
                <DialogHeader className="p-6 pb-4 bg-slate-50 border-b border-slate-100">
                    <DialogTitle className="text-2xl font-bold text-slate-900 font-teko uppercase tracking-wide flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-blue-600" /> Check Out Asset
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium mt-1">
                        Assigning <span className="font-bold text-slate-700">{tool.name}</span> to the field.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-5">

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <HardHat className="w-4 h-4 text-slate-400" /> Signing Out As
                        </label>
                        <div className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-600 flex items-center">
                            {session?.user?.name || session?.user?.email || "Loading Session..."}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" /> Job Site Location
                        </label>
                        <select
                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option>Data Center Phase 1</option>
                            <option>Hospital Yard</option>
                            <option>Texas Hub</option>
                            <option>Colorado Springs</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4 text-slate-400" /> Out Date
                            </label>
                            <input
                                type="date"
                                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <Clock className="w-4 h-4 text-slate-400" /> Duration
                            </label>
                            <select className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <option>1 Day</option>
                                <option>1 Week</option>
                                <option>1 Month</option>
                                <option>Until Finished</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4 text-slate-400" /> Expected Return (Optional)
                        </label>
                        <input
                            type="date"
                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                </div>

                <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 sm:justify-between">
                    <Button variant="ghost" onClick={onClose} className="text-slate-600 font-semibold hover:bg-slate-200">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-slate-900 hover:bg-blue-600 transition-colors text-white font-bold px-6 shadow-sm">
                        Confirm Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
