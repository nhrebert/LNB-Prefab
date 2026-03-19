"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, User, Calendar } from "lucide-react";

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-sm">
                <DialogHeader className="p-6 pb-4 bg-slate-50 border-b border-slate-100">
                    <DialogTitle className="text-2xl font-bold text-slate-900 font-teko uppercase tracking-wide flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" /> Create New Job Site
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium mt-1">
                        Register a new project location to begin routing tools and assigning superintendents.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Project Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Phoenix Metro Core"
                                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-slate-400" /> Location / Address
                            </label>
                            <input
                                type="text"
                                placeholder="City or Physical Address"
                                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-300"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                    <User className="w-4 h-4 text-slate-400" /> Assigned Superintendent
                                </label>
                                <select className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option>Select Manager...</option>
                                    <option>Dave Williams</option>
                                    <option>Sarah Jenkins</option>
                                    <option>Mike Torres</option>
                                    <option>Lisa Chen</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-slate-400" /> Target Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 sm:justify-between">
                    <Button variant="ghost" onClick={onClose} className="text-slate-600 font-semibold hover:bg-slate-200">
                        Cancel
                    </Button>
                    <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-sm">
                        Create Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
