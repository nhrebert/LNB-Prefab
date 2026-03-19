import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationHeader } from '@/components/NavigationHeader';
import { 
    ArrowLeft, Box, Hammer, CheckCircle2, Truck, ClipboardCheck, 
    Wrench, Package, ListChecks, Calendar
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Work Order Details | Loenbro',
};

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    
    // In a real scenario, fetch details from Firebase Admin
    const wo = {
        id: decodedId,
        name: "CO250040 - Microsoft CYSO19",
        description: "Colo 4 - 30X4 TRAY - 2nd Half",
        status: "Kitting", // Example status mapping into the workflow
        category: "Ceiling Rough_In",
        progress: 25,
        qcBy: "Pending",
        due: "Aug 15, 2026",
    };

    const statuses = ['Planning', 'Kitting', 'Assembly', 'QC Inspection', 'Ready for Ship', 'Delivered'];
    const currentStatusIdx = statuses.indexOf(wo.status) >= 0 ? statuses.indexOf(wo.status) : 0;

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
            <NavigationHeader />
            <main className="flex-1 container mx-auto px-6 py-8 max-w-6xl">
                {/* Top Nav */}
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Prefab Shop
                    </Link>
                </div>

                {/* Header Board */}
                <Card className="bg-white border-2 border-slate-200 shadow-sm rounded-xl mb-8 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="bg-white border-slate-300 text-slate-600 font-bold px-3 py-1 shadow-sm uppercase tracking-widest text-[10px]">{wo.category}</Badge>
                                <Badge variant="secondary" className="bg-[#13406A]/10 text-[#13406A] hover:bg-[#13406A]/20 font-bold px-3 py-1 shadow-sm uppercase tracking-widest text-[10px]">Due: {wo.due}</Badge>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                                {wo.id}
                            </h1>
                            <p className="text-xl font-bold text-slate-700 mt-2">{wo.name}</p>
                            <p className="text-md font-medium text-slate-500 mt-1">{wo.description}</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="bg-white border-slate-300 text-slate-700 font-bold h-10 px-4 rounded-md shadow-sm transition-all hover:bg-slate-50">
                                Edit Properties
                            </Button>
                        </div>
                    </div>
                    {/* Status Pipeline Bar */}
                    <div className="bg-white px-8 py-8 pt-10">
                        <div className="relative flex justify-between">
                            <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-slate-100 rounded-full z-0"></div>
                            {/* Compute the progress of the bar itself */}
                            <div 
                                className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-[#FF6B00] transition-all duration-500 z-0 rounded-full"
                                style={{ width: `${(currentStatusIdx / (statuses.length - 1)) * 100}%` }}
                            ></div>
                            
                            {statuses.map((s, idx) => {
                                const isCompleted = idx < currentStatusIdx;
                                const isCurrent = idx === currentStatusIdx;
                                return (
                                    <div key={s} className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer w-24">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-white transition-all
                                            ${isCompleted ? 'bg-[#FF6B00] text-white hover:scale-110' : 
                                              isCurrent ? 'bg-white border-2 border-[#FF6B00] text-[#FF6B00] ring-[#FF6B00]/20 scale-110' : 
                                              'bg-slate-100 text-slate-400 border-2 border-slate-200 hover:bg-slate-200'}
                                        `}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : (idx + 1)}
                                        </div>
                                        <span className={`text-xs text-center font-bold uppercase tracking-wider ${isCurrent ? 'text-[#FF6B00]' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {s}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Card>

                {/* 4 Primary Work Tabs */}
                <Tabs defaultValue="bom" className="w-full">
                    <TabsList className="bg-slate-200/80 p-1 mb-8 w-full justify-start h-14 rounded-xl">
                        <TabsTrigger value="bom" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5 font-bold text-sm text-slate-600 data-[state=active]:text-slate-900 flex items-center gap-2 transition-all">
                            <Package className="w-4 h-4" /> BOM & Kitting
                        </TabsTrigger>
                        <TabsTrigger value="tooling" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5 font-bold text-sm text-slate-600 data-[state=active]:text-slate-900 flex items-center gap-2 transition-all">
                            <Wrench className="w-4 h-4" /> Tool Checkout
                        </TabsTrigger>
                        <TabsTrigger value="qc" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5 font-bold text-sm text-slate-600 data-[state=active]:text-slate-900 flex items-center gap-2 transition-all">
                            <ClipboardCheck className="w-4 h-4" /> QA/QC Sign-off
                        </TabsTrigger>
                        <TabsTrigger value="logistics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5 font-bold text-sm text-slate-600 data-[state=active]:text-slate-900 flex items-center gap-2 transition-all">
                            <Truck className="w-4 h-4" /> Logistics
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="bom" className="focus:outline-none">
                        <Card className="bg-white border-2 border-slate-200 shadow-sm rounded-xl overflow-hidden p-12 flex flex-col items-center justify-center text-center opacity-80 min-h-[300px]">
                            <Package className="w-16 h-16 text-slate-300 mb-4" />
                            <h3 className="text-2xl font-black text-slate-700">Bill of Materials</h3>
                            <p className="text-slate-500 font-medium mt-2 max-w-sm">Scan raw materials and drop them at the target fabrication station. Mark as "Kitted" when complete.</p>
                            <Button className="mt-6 bg-[#13406A] text-white hover:bg-[#0c2a47] font-bold px-6 py-5 rounded-md shadow-md text-sm">Review Material List</Button>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="tooling" className="focus:outline-none">
                        <Card className="bg-white border-2 border-slate-200 shadow-sm rounded-xl overflow-hidden p-12 flex flex-col items-center justify-center text-center opacity-80 min-h-[300px]">
                            <Wrench className="w-16 h-16 text-slate-300 mb-4" />
                            <h3 className="text-2xl font-black text-slate-700">Specialized Tooling</h3>
                            <p className="text-slate-500 font-medium mt-2 max-w-sm">Ensure the shop floor has checked out the correct benders, crimpers, and rigging assigned from the main Tool Hub.</p>
                            <Button className="mt-6 bg-[#13406A] text-white hover:bg-[#0c2a47] font-bold px-6 py-5 rounded-md shadow-md text-sm">Check Out via Hub</Button>
                        </Card>
                    </TabsContent>

                    <TabsContent value="qc" className="focus:outline-none">
                        <Card className="bg-white border-2 border-slate-200 shadow-sm rounded-xl overflow-hidden p-12 flex flex-col items-center justify-center text-center opacity-80 min-h-[300px]">
                            <ClipboardCheck className="w-16 h-16 text-slate-300 mb-4" />
                            <h3 className="text-2xl font-black text-slate-700">Quality Assurance</h3>
                            <p className="text-slate-500 font-medium mt-2 max-w-sm">Supervisor signature pad for approving welds, torques, and build conformance prior to shipment.</p>
                            <Button className="mt-6 bg-[#13406A] text-white hover:bg-[#0c2a47] font-bold px-6 py-5 rounded-md shadow-md text-sm">Open QC Form</Button>
                        </Card>
                    </TabsContent>

                    <TabsContent value="logistics" className="focus:outline-none">
                        <Card className="bg-white border-2 border-slate-200 shadow-sm rounded-xl overflow-hidden p-12 flex flex-col items-center justify-center text-center opacity-80 min-h-[300px]">
                            <Truck className="w-16 h-16 text-slate-300 mb-4" />
                            <h3 className="text-2xl font-black text-slate-700">Shipping & Logistics</h3>
                            <p className="text-slate-500 font-medium mt-2 max-w-sm">Generate shipping barcodes, assign to transit pallets, and track delivery to the job site.</p>
                            <Button className="mt-6 bg-[#13406A] text-white hover:bg-[#0c2a47] font-bold px-6 py-5 rounded-md shadow-md text-sm">Generate Shipping Label</Button>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
