"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

interface WorkOrder {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    progress: number;
    qcBy: string;
    due: string;
    actualDelivery: string;
    tools: string[];
}

import { bulkImportWorkOrdersAction } from "@/actions/prefab";

export function PrefabImportModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewCount, setPreviewCount] = useState<number | null>(null);
    const [parsedData, setParsedData] = useState<WorkOrder[] | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

                // Assuming Excel format matches `RM - Prefab Schedule (1).xlsx` structure parsed earlier
                // Row 1 or 2 is usually headers. Let's find exactly the headers
                let mappedOrders: WorkOrder[] = [];
                let headersRowIdx = -1;
                
                // Scan to find the header row containing 'Work Order #' or similar
                for (let i = 0; i < Math.min(10, rawData.length); i++) {
                    const row = rawData[i];
                    if (row && row.some(cell => String(cell).toLowerCase().includes("work order"))) {
                        headersRowIdx = i;
                        break;
                    }
                }

                if (headersRowIdx === -1) {
                    toast.error("Could not locate 'Work Order #' column in the file.");
                    setIsProcessing(false);
                    return;
                }

                const headers = rawData[headersRowIdx].map(h => String(h || "").trim().toLowerCase());
                
                const getCell = (row: any[], headerKeys: string[]) => {
                    for (const key of headerKeys) {
                        const idx = headers.findIndex(h => h.includes(key));
                        if (idx !== -1 && row[idx] !== undefined) return String(row[idx]);
                    }
                    return "";
                };

                for (let i = headersRowIdx + 1; i < rawData.length; i++) {
                    const row = rawData[i];
                    if (!row || row.length === 0) continue;

                    const id = getCell(row, ["work order"]);
                    if (!id) continue;

                    // Parse percent complete (try to extract number)
                    const rawProgress = getCell(row, ["% complete", "progress", "complete"]);
                    let progress = 0;
                    if (rawProgress) {
                        const extractedNum = parseFloat(rawProgress.replace(/[^\d.]/g, ''));
                        // If it's a decimal like 0.75 in excel, we multiply by 100. If 75, we keep 75.
                        // Assuming the spreadsheet uses raw percentage formatting.
                        progress = isNaN(extractedNum) ? 0 : (extractedNum <= 1 ? extractedNum * 100 : extractedNum);
                    }

                    mappedOrders.push({
                        id: id,
                        name: getCell(row, ["project job", "project", "job", "name"]),
                        description: getCell(row, ["task", "description"]),
                        category: getCell(row, ["category", "type"]),
                        status: getCell(row, ["status"]),
                        progress: progress,
                        qcBy: getCell(row, ["qc", "quality"]),
                        due: getCell(row, ["due date", "due"]),
                        actualDelivery: getCell(row, ["actual delivery", "delivered date", "delivery"]),
                        tools: []
                    });
                }

                setParsedData(mappedOrders);
                setPreviewCount(mappedOrders.length);
            } catch (error) {
                console.error("Error parsing Excel:", error);
                toast.error("Invalid Excel document format.");
            } finally {
                setIsProcessing(false);
            }
        };

        reader.readAsBinaryString(file);
    };

    const confirmImport = async () => {
        if (!parsedData || parsedData.length === 0) return;
        setIsProcessing(true);
        toast.loading("Transferring Prefab Schedules to Cloud...", { id: "import" });
        
        const result = await bulkImportWorkOrdersAction(parsedData);
        if (result.success) {
            toast.success(`Successfully mapped ${result.count} Work Orders!`, { id: "import" });
            setOpen(false);
            setParsedData(null);
            setPreviewCount(null);
        } else {
            toast.error(result.error || "Import failed.", { id: "import" });
        }
        setIsProcessing(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Import Prefabrication Schedules</DialogTitle>
                    <DialogDescription>
                        Upload your 'RM - Prefab Schedule.xlsx' standard files to immediately map work order flows to the cloud.
                    </DialogDescription>
                </DialogHeader>

                {!previewCount ? (
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 mt-4 group hover:border-[#FF6B00] transition-colors relative">
                        <UploadCloud className="w-12 h-12 text-slate-400 group-hover:text-[#FF6B00] transition-colors mb-4" />
                        <h3 className="font-semibold text-slate-700 text-lg">Click or Drag & Drop Excel File</h3>
                        <p className="text-sm text-slate-500 mt-1">.xlsx or .csv formats supported</p>
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileUpload}
                            disabled={isProcessing}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 mt-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">File Parsed Successfully</h3>
                        <p className="text-slate-600 mt-2 font-medium">Found <span className="font-bold text-emerald-600">{previewCount}</span> Valid Work Orders.</p>
                        <Button 
                            onClick={confirmImport} 
                            disabled={isProcessing}
                            className="w-full mt-6 bg-[#13406A] hover:bg-blue-800 h-12 font-bold text-lg"
                        >
                            {isProcessing ? "Uploading Matrix..." : "Confirm Cloud Sync"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

