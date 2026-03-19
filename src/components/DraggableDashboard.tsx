"use client";

import React, { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, AlertTriangle, CheckCircle2, Box, Navigation, Truck, Calendar, DollarSign, Activity, Clock, TrendingUp, Hammer } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { projectsData } from "@/app/projects/page";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- WIDGET COMPONENTS ---

const KPIAssets = ({ handleNavigate, listeners }: { handleNavigate: (url: string) => void, listeners: any }) => {
    const initialInventory = useAppStore(state => state.inventory);
    return (
        <div onClick={() => handleNavigate("/inventory")} className="block focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl h-full w-full">
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden relative group h-full cursor-pointer">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/80 to-transparent rounded-bl-full z-0 group-hover:scale-110 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Total Assets</CardTitle>
                    <div className="p-2 bg-blue-100/80 rounded-lg text-blue-600 shadow-sm"><Box className="w-4 h-4" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{initialInventory.length}</div>
                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5 opacity-80">
                        Tracked Organization Wide
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

const KPIDeployments = ({ handleNavigate, listeners }: { handleNavigate: (url: string) => void, listeners: any }) => {
    const initialInventory = useAppStore(state => state.inventory);
    return (
        <div onClick={() => handleNavigate("/projects")} className="block focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 rounded-xl h-full w-full">
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden relative group h-full cursor-pointer">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/80 to-transparent rounded-bl-full z-0 group-hover:scale-110 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-slate-500 group-hover:text-[#FF6B00] transition-colors">Active Deployments</CardTitle>
                    <div className="p-2 bg-orange-100/80 rounded-lg text-[#FF6B00] shadow-sm"><ArrowRightLeft className="w-4 h-4" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{initialInventory.filter(t => t.status === "Checked Out").length}</div>
                    <p className="text-xs font-semibold text-[#FF6B00] mt-1 flex items-center gap-1.5 opacity-90">
                        Across {projectsData.length} active projects
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

const KPIInspections = ({ handleNavigate, listeners }: { handleNavigate: (url: string) => void, listeners: any }) => {
    const initialInventory = useAppStore(state => state.inventory);
    return (
        <div onClick={() => handleNavigate("/inventory?filter=inspection")} className="block focus:outline-none focus:ring-2 focus:ring-orange-500/50 rounded-sm h-full w-full">
            <Card className="bg-white border-0 shadow-sm border border-slate-200 ring-1 ring-orange-200 hover:shadow-[0_4px_20px_rgb(249,115,22,0.1)] hover:-translate-y-0.5 transition-all duration-300 rounded-sm overflow-hidden relative group h-full cursor-pointer">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[80px] z-0 group-hover:scale-110 group-hover:bg-orange-100/50 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-orange-600 hover:text-orange-700 transition-colors">Pending Inspections</CardTitle>
                    <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600 shadow-sm"><AlertTriangle className="w-3.5 h-3.5" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{initialInventory.filter(t => t.condition !== "Good").length}</div>
                    <p className="text-xs font-semibold text-orange-600 mt-1 flex items-center gap-1.5 opacity-90">
                        Awaiting Warehouse
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

const KPIMaintenance = ({ handleNavigate, listeners }: { handleNavigate: (url: string) => void, listeners: any }) => {
    return (
        <div onClick={() => handleNavigate("/inventory")} className="block focus:outline-none focus:ring-2 focus:ring-yellow-500/50 rounded-sm h-full w-full">
            <Card className="bg-white border-0 shadow-sm border border-slate-200 hover:shadow-[0_4px_20px_rgb(234,179,8,0.1)] hover:-translate-y-0.5 transition-all duration-300 rounded-sm overflow-hidden relative group h-full cursor-pointer">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-[80px] z-0 group-hover:scale-110 group-hover:bg-yellow-100/50 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-yellow-600 hover:text-yellow-700 transition-colors">Calibration Alerts</CardTitle>
                    <div className="p-1.5 bg-yellow-100 rounded-lg text-yellow-600 shadow-sm"><Calendar className="w-3.5 h-3.5" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">14</div>
                    <p className="text-xs font-semibold text-yellow-600 mt-1 flex items-center gap-1.5 opacity-90">
                        Due within 30 days
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}



const KPIUtilization = ({ handleNavigate, listeners }: { handleNavigate: (url: string) => void, listeners: any }) => {
    const initialInventory = useAppStore(state => state.inventory);
    const deployed = initialInventory.filter(t => t.status === "Checked Out").length;
    const total = initialInventory.length;
    const rate = total > 0 ? Math.round((deployed / total) * 100) : 0;

    return (
        <div onClick={() => handleNavigate("/reports")} className="block focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-xl h-full w-full">
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden relative group h-full cursor-pointer">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/80 to-transparent rounded-bl-full z-0 group-hover:scale-110 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">Utilization Rate</CardTitle>
                    <div className="p-2 bg-emerald-100/80 rounded-lg text-emerald-600 shadow-sm"><Activity className="w-4 h-4" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{rate}%</div>
                    <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1.5 opacity-90">
                        Active vs Idle Assets
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

const TrendChart = ({ handleNavigate, listeners }: { handleNavigate: (url: string) => void, listeners: any }) => {
    const data = [
      { name: 'Mon', checkedOut: 45, returned: 20 },
      { name: 'Tue', checkedOut: 58, returned: 35 },
      { name: 'Wed', checkedOut: 78, returned: 40 },
      { name: 'Thu', checkedOut: 65, returned: 55 },
      { name: 'Fri', checkedOut: 85, returned: 45 },
      { name: 'Sat', checkedOut: 90, returned: 50 },
      { name: 'Sun', checkedOut: 95, returned: 60 },
    ];

    return (
        <Card className="bg-white border-0 shadow-sm shadow-[#13406A]/5 rounded-xl overflow-hidden h-full flex flex-col">
            <CardHeader {...listeners} className="border-b border-slate-100 bg-slate-50/50 pb-4 cursor-grab active:cursor-grabbing">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold font-teko uppercase tracking-wide text-slate-800">7-Day Deployment Velocity</CardTitle>
                        <CardDescription className="text-slate-500 mt-1 text-sm font-medium">
                            Comparing tool checkouts vs returns.
                        </CardDescription>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col justify-center min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorChecked" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#13406A" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#13406A" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                            cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="checkedOut" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#colorChecked)" name="Checked Out" />
                        <Area type="monotone" dataKey="returned" stroke="#13406A" strokeWidth={3} fillOpacity={1} fill="url(#colorReturned)" name="Returned" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

const OverdueList = ({ handleNavigate, listeners }: { handleNavigate: (url: string) => void, listeners: any }) => {
    const overdueTools = [
        { asset: "Fluke Multimeter T9", user: "Dave W.", days: 12 },
        { asset: "DeWalt Drill FX", user: "Mike T.", days: 4 },
        { asset: "Generac Generator Mk2", user: "Jane S.", days: 2 }
    ];

    return (
        <Card className="bg-white border-0 shadow-sm border border-slate-200 rounded-sm overflow-hidden h-full">
            <CardHeader {...listeners} className="border-b border-rose-100 bg-rose-50/50 pb-4 cursor-grab active:cursor-grabbing">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-600">
                        <Clock className="w-5 h-5" />
                        <CardTitle className="text-xl font-bold font-teko uppercase tracking-wide">Action Required: Overdue Returns</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col">
                    {overdueTools.map((tool, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-800 text-sm">{tool.asset}</span>
                                <span className="text-xs font-semibold text-slate-500 mt-1">Checked out to: {tool.user}</span>
                            </div>
                            <Badge variant="outline" className="bg-rose-50 border-rose-200 text-rose-700 font-bold px-3 py-1 rounded-md">
                                {tool.days} Days Overdue
                            </Badge>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                    <button onClick={() => handleNavigate("/reports")} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">View Full Overdue Report</button>
                </div>
            </CardContent>
        </Card>
    )
};

const RecentActivity = ({ handleNavigate, listeners }: { handleNavigate: (url: string) => void, listeners: any }) => {
    const [expanded, setExpanded] = useState(false);
    const [tick, setTick] = useState(0);
    const transactions = useAppStore(state => state.transactions);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatTimeAgo = (isoString: string) => {
        if (!isoString) return "Just now";
        const timestamp = new Date(isoString).getTime();
        if (isNaN(timestamp)) return "Just now"; // Fallback for bad data
        const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
        if (diffInSeconds < 60) return "Just now";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d`;
    };

    // Filter out transactions older than 72 hours, fail-safe check
    const TIME_LIMIT = 3 * 24 * 60 * 60 * 1000;
    const recentTx = mounted ? transactions.filter(t => {
        const time = new Date(t.time).getTime();
        if (isNaN(time)) return true; // Show anything that fails parsing temporarily if corrupted
        return (Date.now() - time) <= TIME_LIMIT;
    }) : transactions;

    return (
        <Card className="bg-white border-0 shadow-sm border border-slate-200 rounded-sm overflow-hidden h-full">
            <CardHeader {...listeners} className="border-b border-slate-100 bg-slate-50/50 pb-6 cursor-grab active:cursor-grabbing">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-900 font-teko uppercase tracking-wide">Recent Transactions</CardTitle>
                        <CardDescription className="text-slate-500 mt-1 text-base">
                            Latest tool movements across the organization.
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => setExpanded(!expanded)}
                        variant="outline" className="text-sm font-medium border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full px-4"
                    >
                        {expanded ? "Collapse" : "View All"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-slate-500 font-semibold py-4 px-6 uppercase tracking-wider text-xs">Asset</TableHead>
                            <TableHead className="text-slate-500 font-semibold py-4 px-6 uppercase tracking-wider text-xs">Action</TableHead>
                            <TableHead className="text-slate-500 font-semibold py-4 px-6 uppercase tracking-wider text-xs">Project</TableHead>
                            <TableHead className="text-slate-500 font-semibold py-4 px-6 uppercase tracking-wider text-xs">User / Crew</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTx.slice(0, expanded ? undefined : 4).map((row, i) => (
                            <TableRow key={i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800">{row.asset}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge
                                        variant="outline"
                                        className={
                                            row.status === 'success' ? 'border-emerald-200 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-semibold' :
                                                row.status === 'alert' ? 'border-red-200 text-red-700 bg-red-50 px-3 py-1 rounded-full font-semibold' :
                                                    row.status === 'transfer' ? 'border-blue-200 text-blue-700 bg-blue-50 px-3 py-1 rounded-full font-semibold' :
                                                        'border-slate-200 text-slate-700 bg-slate-50 px-3 py-1 rounded-full font-semibold'
                                        }
                                    >
                                        {row.action}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 font-medium px-6 py-4">{row.proj}</TableCell>
                                <TableCell className="text-slate-600 font-medium px-6 py-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 hidden xl:flex">
                                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.user}`} alt="" />
                                    </div>
                                    {row.user}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
};


const WIDGET_REGISTRY: Record<string, { component: React.FC<any>; span: string }> = {
    "kpi-assets": { component: KPIAssets, span: "col-span-1" },
    "kpi-deployments": { component: KPIDeployments, span: "col-span-1" },
    "kpi-utilization": { component: KPIUtilization, span: "col-span-1" },
    "trend-chart": { component: TrendChart, span: "col-span-1 lg:col-span-2" },
    "kpi-inspections": { component: KPIInspections, span: "col-span-1" },
    "recent-activity": { component: RecentActivity, span: "col-span-1 md:col-span-2 lg:col-span-3" },
};

// --- SORTABLE WRAPPER ---

interface SortableWidgetProps {
    id: string;
    handleNavigate: (url: string) => void;
}

function SortableWidget({ id, handleNavigate }: SortableWidgetProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        opacity: isDragging ? 0.8 : 1,
        position: isDragging ? "relative" as const : "static" as const,
    };

    const widgetConfig = WIDGET_REGISTRY[id];
    if (!widgetConfig) return null;

    const WidgetComponent = widgetConfig.component;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${widgetConfig.span} flex`}
            {...attributes}
        >
            <div className={`w-full h-full ${isDragging ? 'pointer-events-none' : ''}`}>
                <WidgetComponent handleNavigate={handleNavigate} listeners={listeners} />
            </div>
        </div>
    );
}

// --- MAIN DASHBOARD COMPONENT ---

export function DraggableDashboard() {
    const [items, setItems] = useState(Object.keys(WIDGET_REGISTRY));
    const [isDragging, setIsDragging] = useState(false);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require dragging a bit to avoid accidental triggers
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        // Aggressively pre-cache the heavy pages when dashboard loads
        router.prefetch("/inventory");
        router.prefetch("/projects");
        router.prefetch("/reports");
    }, [router]);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setIsDragging(false);
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleNavigate = (url: string) => {
        if (!isDragging) {
            router.push(url);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                    {items.map((id) => (
                        <SortableWidget key={id} id={id} handleNavigate={handleNavigate} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
