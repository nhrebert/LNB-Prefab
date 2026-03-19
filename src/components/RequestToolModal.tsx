"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, PackageSearch } from "lucide-react";

interface RequestToolModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RequestToolModal({ isOpen, onClose }: RequestToolModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-sm">
                <DialogHeader className="p-6 pb-4 bg-slate-50 border-b border-slate-100">
                    <DialogTitle className="text-2xl font-bold text-slate-900 font-teko uppercase tracking-wide flex items-center gap-2">
                        <PackageSearch className="w-5 h-5 text-blue-600" /> Request Asset
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium mt-1">
                        Requisition tools from the warehouse to your active job site.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Project / Destination</label>
                        <select className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>Select active project...</option>
                            <option>Data Center Phase 1</option>
                            <option>Hospital Expansion</option>
                            <option>Texas Hub (Core)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Tool Category</label>
                        <select className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>Wire Pulling & Bending</option>
                            <option>Testing & Measurement</option>
                            <option>Power Tools</option>
                            <option>Heavy Equipment</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4 text-slate-400" /> Request Date
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
                                <option>2 Weeks</option>
                                <option>1 Month</option>
                                <option>Until Phase Complete</option>
                            </select>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 sm:justify-between">
                    <Button variant="ghost" onClick={onClose} className="text-slate-600 font-semibold hover:bg-slate-200">
                        Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-sm">
                        Submit Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
