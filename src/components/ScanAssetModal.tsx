import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { Scan, PlusCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { AssetDetailsModal } from "./AssetDetailsModal";

interface ScanAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ScanAssetModal({ isOpen, onClose }: ScanAssetModalProps) {
    const [scannedId, setScannedId] = useState("");
    const [isAddMode, setIsAddMode] = useState(false);

    // New Tool Form State
    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);
    const inventory = useAppStore(state => state.inventory);

    // Currently selected tool if found
    const [foundToolId, setFoundToolId] = useState<string | null>(null);

    // Assuming we added an addToolStore function to zustand store. We will add this later.
    const addToolStore = useAppStore(state => (state as any).addTool);
    const checkInStore = useAppStore(state => state.checkInTool);

    useEffect(() => {
        if (isOpen) {
            setScannedId("");
            setIsAddMode(false);
            setFoundToolId(null);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleScanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scannedId.trim()) return;

        const found = inventory.find(t => t.id.toLowerCase() === scannedId.trim().toLowerCase());

        if (found) {
            // Found it! 
            if (found.status !== 'Available') {
                // If the tool is checked out/missing, immediately check it back in!
                checkInStore(found.id);
            }

            // Still show details modal so they can verify and close
            setFoundToolId(found.id);
        } else {
            // Not found, prompt to add
            setIsAddMode(true);
        }
    };

    const handleAddNewAsset = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newCategory) return;

        const newTool = {
            id: scannedId.trim(),
            name: newName,
            category: newCategory,
            image: "", // Handled in DB or leave empty
            status: "Available",
            location: "Warehouse",
            condition: "Good"
        };

        if (addToolStore) {
            addToolStore(newTool);
        }

        // Success
        onClose();
    };

    const foundTool = foundToolId ? inventory.find(t => t.id === foundToolId) || null : null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md p-8 border-0 shadow-2xl rounded-2xl">
                    {!isAddMode ? (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-extrabold flex items-center gap-2">
                                    <Scan className="w-6 h-6 text-blue-600" />
                                    Scan Tool Barcode
                                </DialogTitle>
                                <DialogDescription className="text-base mt-2">
                                    Use your EXO barcode scanner or enter the Asset ID manually.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleScanSubmit} className="space-y-6 mt-4">
                                <div>
                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Asset ID</Label>
                                    <Input
                                        ref={inputRef}
                                        value={scannedId}
                                        onChange={(e: any) => setScannedId(e.target.value)}
                                        placeholder="E.g., EQP-1052"
                                        className="h-14 text-xl font-mono text-center tracking-widest bg-slate-50 border-2 focus-visible:ring-blue-500"
                                        autoComplete="off"
                                    />
                                    <p className="text-xs text-slate-400 text-center mt-3 font-medium">Scanner will automatically submit when ready.</p>
                                </div>

                                <DialogFooter className="sm:justify-between w-full mt-8">
                                    <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto font-semibold">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-md">
                                        Process Scan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-extrabold flex items-center gap-2 text-slate-900">
                                    <PlusCircle className="w-6 h-6 text-emerald-600" />
                                    New Asset Detected
                                </DialogTitle>
                                <DialogDescription className="text-base mt-2">
                                    The barcode <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{scannedId}</span> was not found in the database. Please register this new asset.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleAddNewAsset} className="space-y-5 mt-4">
                                <div>
                                    <Label className="text-sm font-bold text-slate-700 mb-1.5 block">Asset Name / Title</Label>
                                    <Input
                                        value={newName}
                                        onChange={(e: any) => setNewName(e.target.value)}
                                        placeholder="E.g., Milwaukee M18 Impact Driver"
                                        className="font-medium bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-bold text-slate-700 mb-1.5 block">Category</Label>
                                    <Input
                                        value={newCategory}
                                        onChange={(e: any) => setNewCategory(e.target.value)}
                                        placeholder="E.g., Power Tools"
                                        className="font-medium bg-slate-50 border-slate-200"
                                    />
                                </div>

                                <DialogFooter className="sm:justify-between w-full mt-6 pt-6 border-t border-slate-100">
                                    <Button type="button" variant="ghost" onClick={() => setIsAddMode(false)} className="w-full sm:w-auto font-semibold text-slate-500">
                                        Back to Scan
                                    </Button>
                                    <Button type="submit" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-md">
                                        Add to Inventory
                                    </Button>
                                </DialogFooter>
                            </form>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* If the tool IS found, we show its details modal and close it to reset the scanner */}
            <AssetDetailsModal
                isOpen={!!foundToolId}
                onClose={() => {
                    setFoundToolId(null);
                    onClose();
                }}
                tool={foundTool}
            />
        </>
    );
}
