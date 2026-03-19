"use client";

import { Button } from "@/components/ui/button";
import { PackageSearch, PenTool } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function PrefabTableActions({ workOrderId }: { workOrderId: string }) {
    const router = useRouter();
    
    return (
        <div className="flex items-center justify-end gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/prefab/${encodeURIComponent(workOrderId)}`);
                }}
            >
                <PackageSearch className="w-4 h-4" />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/prefab/${encodeURIComponent(workOrderId)}`);
                }}
            >
                <PenTool className="w-4 h-4" />
            </Button>
        </div>
    );
}
