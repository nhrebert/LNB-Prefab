import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, DollarSign, Tag, Hash, Building2, MapPin, CheckCircle2, XCircle, ArrowRightLeft, Drill, HardHat, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { RequestToolModal } from "@/components/RequestToolModal";

interface ProjectAsset {
    id: string;
    name: string;
    category: string;
    image: string;
    user: string;
    checkedOutDate: string;
    duration: string;
    condition: string;
}

export interface ProjectDetails {
    id: string;
    name: string;
    manager: string;
    status: string;
    startDate: string;
    completion: string;
    location: string;
    coordinates: [number, number];
    image: string;
    assignedToolCount: number;
}

interface ProjectDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: ProjectDetails | null;
}

// Generate highly specific mocked assets based on the project ID
const generateProjectAssets = (projectId: string, count: number, storeUsers: any[]): ProjectAsset[] => {
    const categories = ["Power Tools", "Wire Pulling & Bending", "Testing & Measurement", "Heavy Equipment", "Safety Gear"];
    const users = storeUsers.map(u => u.name);
    const tools = [
        { name: "Greenlee 555 Bender", img: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?w=150&q=80" },
        { name: "Milwaukee M18 FORCE LOGIC", img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=150&q=80" },
        { name: "Fluke 1587 Multimeter", img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=150&q=80" },
        { name: "Genie Scissor Lift", img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=150&q=80" },
        { name: "Southwire Cable Puller", img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=150&q=80" },
        { name: "Ideal Circuit Tracer", img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=150&q=80" }
    ];

    const seed = parseInt(projectId.replace('PRJ-', '')) || 900;

    return Array.from({ length: count }).map((_, i) => {
        const itemIdx = (seed + i) % tools.length;
        return {
            id: `EQP-${1000 + itemIdx * 3 + i}`,
            name: tools[itemIdx].name,
            category: categories[(seed + i) % categories.length],
            image: tools[itemIdx].img,
            user: users[(seed + i) % users.length],
            checkedOutDate: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            duration: ["1 Week", "1 Month", "2 Weeks", "Until Finished"][i % 4],
            condition: Math.random() > 0.85 ? "Needs Repair" : "Good"
        }
    });
};

export function ProjectDetailsModal({ isOpen, onClose, project }: ProjectDetailsModalProps) {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const storeUsers = useAppStore(state => state.users) || [];

    if (!project) return null;

    const assignedAssets = generateProjectAssets(project.id, project.assignedToolCount, storeUsers);

    return (
        <>
            <RequestToolModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-sm h-[85vh] flex flex-col">
                    {/* Header Profile Section */}
                    <DialogHeader className="p-0 border-b border-slate-100 flex-shrink-0 relative h-48">
                        <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                        <div className="relative h-full flex items-end p-8 pb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge className={`font-bold uppercase tracking-wider text-xs px-3 py-1 ${project.status === 'Active' ? 'bg-emerald-500 hover:bg-emerald-600 border-0 text-white' :
                                        project.status === 'Warning' ? 'bg-orange-500 hover:bg-orange-600 border-0 text-white' :
                                            'bg-slate-500 hover:bg-slate-600 border-0 text-white'
                                        }`}>
                                        {project.status}
                                    </Badge>
                                    <span className="text-white/80 text-sm font-semibold flex items-center gap-1.5 backdrop-blur-sm bg-black/20 px-2 py-0.5 rounded-full">
                                        <MapPin className="w-3.5 h-3.5" /> {project.location}
                                    </span>
                                </div>
                                <DialogTitle className="text-3xl font-extrabold text-white">{project.name}</DialogTitle>

                                <div className="flex items-center gap-6 mt-4 text-white/90">
                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                        <HardHat className="w-4 h-4 text-emerald-400" /> Superintendent: {project.manager}
                                    </span>
                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                        <Drill className="w-4 h-4 text-blue-400" /> {project.assignedToolCount} Assets Deployed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex items-center justify-between px-8 py-3 bg-slate-50 border-b border-slate-100 flex-shrink-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Site Roster</span>
                        <Button
                            size="sm"
                            onClick={() => setIsRequestModalOpen(true)}
                            className="bg-slate-900 text-white hover:bg-blue-600 font-bold shadow-sm"
                        >
                            Assign New Tool to Site
                        </Button>
                    </div>

                    {/* Asset Table Container */}
                    <ScrollArea className="flex-1 px-4 py-2">
                        {assignedAssets.length > 0 ? (
                            <div className="px-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-100 bg-white hover:bg-white border-b-2">
                                            <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider py-4">Asset Details</TableHead>
                                            <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider py-4 w-48">Checked Out By</TableHead>
                                            <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider py-4 w-40">Deployed On</TableHead>
                                            <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider py-4">Duration</TableHead>
                                            <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider py-4 text-right">Condition</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assignedAssets.map((asset) => (
                                            <TableRow key={asset.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                {/* Tool Image & Info */}
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
                                                            <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-sm whitespace-nowrap">{asset.name}</p>
                                                            <p className="font-mono text-[10px] font-bold text-slate-400 mt-0.5">{asset.id} • {asset.category}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* User */}
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 shadow-inner">
                                                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${asset.user}`} alt="" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-700">{asset.user}</span>
                                                    </div>
                                                </TableCell>

                                                {/* Checked Out Date */}
                                                <TableCell className="py-4">
                                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        {asset.checkedOutDate}
                                                    </span>
                                                </TableCell>

                                                {/* Duration */}
                                                <TableCell className="py-4">
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-0 font-bold shadow-sm whitespace-nowrap">
                                                        <Clock className="w-3 h-3 mr-1" /> {asset.duration}
                                                    </Badge>
                                                </TableCell>

                                                {/* Condition */}
                                                <TableCell className="py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {asset.condition === 'Good' ?
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                        }
                                                        <span className={`text-sm font-bold ${asset.condition === 'Good' ? 'text-slate-600' : 'text-red-600'}`}>
                                                            {asset.condition}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-center px-4">
                                <Drill className="w-12 h-12 text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 font-teko uppercase tracking-wide">No Assets Assigned</h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-sm">There are currently zero tools deployed to this job site. Click "Assign New Tool" to deploy inventory from a warehouse.</p>
                            </div>
                        )}
                    </ScrollArea>

                </DialogContent>
            </Dialog>
        </>
    );
}
