import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Hammer, PackageSearch, PenTool, UploadCloud, ChevronLeft, ChevronRight, Activity, CheckCircle2, Box } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { getWorkOrdersAction } from '@/actions/prefab';
import { PrefabImportModal } from '@/components/PrefabImportModal';
import { NavigationHeader } from '@/components/NavigationHeader';
import { PrefabTableActions } from '@/components/PrefabTableActions';
import { DraggablePrefabDashboard } from '@/components/DraggablePrefabDashboard';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Prefabrication Tracking | Loenbro',
};

// Next.js page runs on server
export default async function PrefabPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const dt = await getWorkOrdersAction();
    // Removed fallback so UI strictly reflects the Real Database
    const activeData = dt;

    const resolvedParams = props.searchParams ? await props.searchParams : {};
    const page = Number(resolvedParams?.page) || 1;
    const pageSize = 20;
    const totalPages = Math.max(1, Math.ceil(activeData.length / pageSize));
    const paginatedData = activeData.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
          <NavigationHeader />
          <main className="flex-1 container mx-auto px-6 py-10 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 text-slate-400 mb-2">
                        <Hammer className="w-5 h-5" />
                        <span className="font-semibold tracking-wider text-sm">MANUFACTURING</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight font-teko uppercase">Prefabrication Work Orders</h2>
                    <p className="text-slate-500 mt-2 max-w-2xl text-lg font-medium leading-relaxed">
                        Track kitting, assembly, and bulk checkout of clustered prefab units.
                    </p>
                </div>
                <div className="flex gap-3">
                    <PrefabImportModal>
                        <Button variant="outline" className="flex flex-col items-center justify-center border-slate-200 text-slate-700 font-bold h-20 w-28 rounded-xl shadow-sm transition-all hover:bg-slate-50 text-xs gap-1">
                            <UploadCloud className="w-5 h-5" />
                            Import Docs
                        </Button>
                    </PrefabImportModal>
                    <Button className="flex flex-col items-center justify-center bg-[#FF6B00] hover:bg-[#e66100] text-white font-bold h-20 w-28 rounded-xl shadow-sm transition-all shadow-[#FF6B00]/20 hover:shadow-[#FF6B00]/40 text-xs gap-1">
                        <Plus className="w-5 h-5" />
                        New Order
                    </Button>
                </div>
            </div>

            {/* PREFAB KPI DASHBOARD (Draggable) */}
            <DraggablePrefabDashboard activeData={activeData} />

            <Card className="bg-white border-slate-200 border-2 shadow-sm rounded-lg overflow-hidden">
                <CardHeader className="border-b border-slate-200 bg-slate-50/80 px-8 py-6 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-800">Active Builds</CardTitle>
                        <CardDescription className="text-base mt-1">Manage current fabrication kits and material dependencies.</CardDescription>
                    </div>
                    <div className="relative w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                           <Search className="w-4 h-4" />
                        </div>
                        <Input 
                            type="text" 
                            placeholder="Search Work Orders..." 
                            className="bg-white pl-10 h-10 border-slate-300 focus:border-[#13406A] focus:ring-[#13406A]"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-100 hover:bg-transparent">
                                <TableHead className="py-4 px-8 font-bold text-slate-500 uppercase tracking-wider text-xs">Work Order</TableHead>
                                <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Project / Description</TableHead>
                                <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</TableHead>
                                <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Progress</TableHead>
                                <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Due Date</TableHead>
                                <TableHead className="py-4 px-8 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((wo : any) => {
                                const statusColors: Record<string, string> = {
                                    'Planning': 'bg-slate-100 text-slate-700 border-slate-200',
                                    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
                                    'Ready for Ship': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                };
                                return (
                                <TableRow key={wo.id} className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <TableCell className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <Link href={`/${encodeURIComponent(wo.id)}`} className="font-bold text-[#13406A] group-hover:text-blue-600 hover:underline transition-colors">{wo.id}</Link>
                                            <span className="text-xs font-semibold text-slate-500 mt-1">{wo.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{wo.name}</span>
                                            <span className="text-sm text-slate-500 mt-1 font-medium">{wo.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <Badge variant="outline" className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[wo.status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                            {wo.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <div className="flex items-center gap-3 w-32">
                                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all ${wo.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${wo.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{wo.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <span className="text-sm font-semibold text-slate-700">{wo.due || 'Not Set'}</span>
                                        {wo.qcBy && <div className="text-xs text-slate-500 mt-1">QC: {wo.qcBy}</div>}
                                    </TableCell>
                                    <TableCell className="px-8 py-5 text-right">
                                        <PrefabTableActions workOrderId={wo.id} />
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">
                        Showing {activeData.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, activeData.length)} of {activeData.length} records
                    </span>
                    <div className="flex gap-2">
                        {page > 1 ? (
                            <Link href={`/?page=${page - 1}`}>
                                <Button variant="outline" size="sm" className="h-8">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Prev
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="outline" size="sm" className="h-8 opacity-50 cursor-not-allowed">
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Prev
                            </Button>
                        )}
                        {page < totalPages ? (
                            <Link href={`/?page=${page + 1}`}>
                                <Button variant="outline" size="sm" className="h-8">
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="outline" size="sm" className="h-8 opacity-50 cursor-not-allowed">
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </main>
        </div>
    );
}
