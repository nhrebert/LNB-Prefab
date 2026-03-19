"use client";

import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, Box, PackageOpen, ClipboardCheck } from "lucide-react";

// --- WIDGET COMPONENTS ---

const KPITotalWorkOrders = ({ listeners, activeData }: { listeners: any, activeData: any[] }) => {
    return (
        <div className="block focus:outline-none rounded-xl h-full w-full">
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden relative group h-full cursor-grab active:cursor-grabbing">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/80 to-transparent rounded-bl-full z-0 group-hover:scale-110 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Pipeline Volume</CardTitle>
                    <div className="p-2 bg-blue-100/80 rounded-lg text-blue-600 shadow-sm"><Box className="w-4 h-4" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{activeData.length}</div>
                    <p className="text-xs font-semibold text-slate-500 mt-1 opacity-80">Total Tracked Work Orders</p>
                </CardContent>
            </Card>
        </div>
    );
};

const KPIKittingQueue = ({ listeners, activeData }: { listeners: any, activeData: any[] }) => {
    return (
        <div className="block focus:outline-none rounded-xl h-full w-full">
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden relative group h-full cursor-grab active:cursor-grabbing">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/80 to-transparent rounded-bl-full z-0 group-hover:scale-110 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-slate-500 group-hover:text-[#FF6B00] transition-colors">Kitting Queue</CardTitle>
                    <div className="p-2 bg-orange-100/80 rounded-lg text-[#FF6B00] shadow-sm"><PackageOpen className="w-4 h-4" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{activeData.filter((w: any) => w.status === "Planning" || w.status === "In Progress").length}</div>
                    <p className="text-xs font-semibold text-[#FF6B00] mt-1 opacity-90">Pending Material Assembly</p>
                </CardContent>
            </Card>
        </div>
    );
};

const KPIPendingQC = ({ listeners, activeData }: { listeners: any, activeData: any[] }) => {
    return (
        <div className="block focus:outline-none rounded-xl h-full w-full">
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden relative group h-full cursor-grab active:cursor-grabbing">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100/80 to-transparent rounded-bl-full z-0 group-hover:scale-110 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-slate-500 group-hover:text-purple-600 transition-colors">Pending QC</CardTitle>
                    <div className="p-2 bg-purple-100/80 rounded-lg text-purple-600 shadow-sm"><ClipboardCheck className="w-4 h-4" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{activeData.filter((w: any) => w.status === "QC Inspection").length || 0}</div>
                    <p className="text-xs font-semibold text-purple-600 mt-1 opacity-90">Waiting QA Sign-Off</p>
                </CardContent>
            </Card>
        </div>
    );
};

const KPIReadyForShip = ({ listeners, activeData }: { listeners: any, activeData: any[] }) => {
    return (
        <div className="block focus:outline-none rounded-xl h-full w-full">
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden relative group h-full cursor-grab active:cursor-grabbing">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/80 to-transparent rounded-bl-full z-0 group-hover:scale-110 transition-all duration-500"></div>
                <CardHeader {...listeners} className="flex flex-row items-center justify-between pb-1 pt-4 px-4 relative z-10 cursor-grab active:cursor-grabbing">
                    <CardTitle className="text-xs uppercase tracking-wider font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">Ready for Ship</CardTitle>
                    <div className="p-2 bg-emerald-100/80 rounded-lg text-emerald-600 shadow-sm"><CheckCircle2 className="w-4 h-4" /></div>
                </CardHeader>
                <CardContent className="relative z-10 px-4 pb-4">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{activeData.filter((w: any) => w.status === "Ready for Ship" || w.progress === 100).length}</div>
                    <p className="text-xs font-semibold text-emerald-600 mt-1 opacity-90">Awaiting Logistics Pickup</p>
                </CardContent>
            </Card>
        </div>
    );
};

const WIDGET_REGISTRY: Record<string, { component: React.FC<any>; span: string }> = {
    "kpi-total": { component: KPITotalWorkOrders, span: "col-span-1" },
    "kpi-kitting": { component: KPIKittingQueue, span: "col-span-1" },
    "kpi-qc": { component: KPIPendingQC, span: "col-span-1" },
    "kpi-ready": { component: KPIReadyForShip, span: "col-span-1" },
};

// --- SORTABLE WRAPPER ---

interface SortableWidgetProps {
    id: string;
    activeData: any[];
}

function SortableWidget({ id, activeData }: SortableWidgetProps) {
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
                <WidgetComponent listeners={listeners} activeData={activeData} />
            </div>
        </div>
    );
}

// --- MAIN DASHBOARD COMPONENT ---

export function DraggablePrefabDashboard({ activeData }: { activeData: any[] }) {
    const [items, setItems] = useState(Object.keys(WIDGET_REGISTRY));
    const [isDragging, setIsDragging] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 auto-rows-min">
                    {items.map((id) => (
                        <SortableWidget key={id} id={id} activeData={activeData} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
