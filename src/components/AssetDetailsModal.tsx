import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, DollarSign, Tag, Hash, Building2, MapPin, CheckCircle2, XCircle, ArrowRightLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ToolDetails {
    id: string;
    name: string;
    category: string;
    image: string;
    status: string;
    location: string;
    condition: string;
}

interface AssetDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: ToolDetails | null;
    onCheckIn?: () => void;
    onCheckOut?: () => void;
}

export function AssetDetailsModal({ isOpen, onClose, tool, onCheckIn, onCheckOut }: AssetDetailsModalProps) {
    if (!tool) return null;

    // Generate some deterministic mock data based on the tool ID
    const seed = parseInt(tool.id.replace('EQP-', '')) || 1000;

    const purchaseCost = (seed * 1.34).toFixed(2);
    const serialNumber = `SN-${seed}${Math.floor(seed * 2.5)}-X`;
    const brand = tool.name.split(' ')[0]; // E.g., 'Greenlee', 'Fluke'
    const model = tool.name.substring(tool.name.indexOf(' ') + 1);

    // Mock loan history
    const loanHistory = [
        { user: "Dave Williams", out: "Oct 12, 2023", in: "Oct 28, 2023", condition: "Good" },
        { user: "Sarah Jenkins", out: "Nov 05, 2023", in: "Dec 01, 2023", condition: "Good" },
        { user: "Mike Torres", out: "Jan 14, 2024", in: "Feb 02, 2024", condition: "Minor Scratches" },
        { user: "Current Jobsite", out: "Mar 01, 2024", in: "Active", condition: tool.condition },
    ].reverse();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-sm h-[90vh] flex flex-col">
                <DialogHeader className="p-8 pb-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-start gap-6">
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <DialogTitle className="text-3xl font-extrabold text-slate-900">{tool.name}</DialogTitle>
                                    <DialogDescription className="text-lg font-medium text-slate-500 mt-1">
                                        {tool.category} • {brand}
                                    </DialogDescription>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${tool.status === 'Available' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                                        'border-blue-200 text-blue-700 bg-blue-50'
                                        }`}
                                >
                                    {tool.status}
                                </Badge>
                            </div>

                            <div className="mt-6 flex gap-4">
                                {tool.status === 'Available' ? (
                                    <Button
                                        className="bg-slate-900 hover:bg-blue-600 transition-colors shadow-sm font-bold text-sm h-10 px-6"
                                        onClick={onCheckOut}
                                    >
                                        Check Out Asset
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm h-10 px-6 transition-colors"
                                        onClick={onCheckIn}
                                    >
                                        Check In Asset
                                    </Button>
                                )}
                                <Button variant="secondary" className="bg-slate-100 text-slate-700 font-bold hover:bg-slate-200">
                                    Report Damage
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-8">
                    <div className="grid md:grid-cols-2 gap-10">

                        {/* Left Column: Asset Identity */}
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Identity Details
                                </h3>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="flex justify-between p-4 border-b border-slate-100">
                                        <span className="text-sm font-bold text-slate-500">Asset ID</span>
                                        <span className="text-sm font-mono font-bold text-slate-900">{tool.id}</span>
                                    </div>
                                    <div className="flex justify-between p-4 border-b border-slate-100">
                                        <span className="text-sm font-bold text-slate-500">Brand</span>
                                        <span className="text-sm font-semibold text-slate-900">{brand}</span>
                                    </div>
                                    <div className="flex justify-between p-4 border-b border-slate-100">
                                        <span className="text-sm font-bold text-slate-500">Model</span>
                                        <span className="text-sm font-semibold text-slate-900">{model}</span>
                                    </div>
                                    <div className="flex justify-between p-4 bg-slate-50">
                                        <span className="text-sm font-bold text-slate-500">Serial Number</span>
                                        <span className="text-sm font-mono font-bold text-slate-900">{serialNumber}</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" /> Financials & Lifecycle
                                </h3>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="flex justify-between p-4 border-b border-slate-100">
                                        <span className="text-sm font-bold text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date Purchased</span>
                                        <span className="text-sm font-semibold text-slate-900">May 14, 2022</span>
                                    </div>
                                    <div className="flex justify-between p-4 border-b border-slate-100">
                                        <span className="text-sm font-bold text-slate-500 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Purchase Cost</span>
                                        <span className="text-sm font-semibold text-slate-900">${purchaseCost}</span>
                                    </div>
                                    <div className="flex justify-between p-4 bg-red-50/50">
                                        <span className="text-sm font-bold text-red-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> End of Life (Depreciated)</span>
                                        <span className="text-sm font-semibold text-red-700">May 14, 2027</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Status & Loan History */}
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Current State
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Location</p>
                                        <p className="text-sm font-bold text-slate-900">{tool.location}</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Condition</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {tool.condition === 'Good' ?
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            }
                                            <span className={`text-sm font-bold ${tool.condition === 'Good' ? 'text-slate-900' : 'text-red-600'}`}>
                                                {tool.condition}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    <ArrowRightLeft className="w-4 h-4" /> Chain of Custody
                                </h3>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="border-slate-100 hover:bg-slate-50 group">
                                                <TableHead className="text-xs font-bold text-slate-500 uppercase">Deployed To</TableHead>
                                                <TableHead className="text-xs font-bold text-slate-500 uppercase w-24">Out</TableHead>
                                                <TableHead className="text-xs font-bold text-slate-500 uppercase w-24">In</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loanHistory.map((loan, idx) => (
                                                <TableRow key={idx} className="border-slate-100">
                                                    <TableCell className="font-semibold text-slate-900 text-sm">{loan.user}</TableCell>
                                                    <TableCell className="text-slate-500 text-xs font-mono">{loan.out}</TableCell>
                                                    <TableCell className="text-slate-500 text-xs font-mono">
                                                        {loan.in === 'Active' ? <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Active</span> : loan.in}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </section>
                        </div>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
