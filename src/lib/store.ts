import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialInventory } from './mockData';
import { checkInAction, checkOutAction, updateConditionAction, bulkImportAction, fetchInventory, fetchTransactions, seedInitialData, deleteToolAction, clearAllToolsAction, addToolAction } from '@/actions/inventory';

export interface ToolItem {
    id: string;
    name: string;
    category: string;
    image: string;
    status: string;
    location: string;
    condition: string;
}

export interface Transaction {
    image: string;
    asset: string;
    action: string;
    status: "success" | "transfer" | "checkout" | "alert";
    proj: string;
    user: string;
    time: string;
}

export type UserRole = "System Admin" | "Accessories Role Colorado" | "Asset Manager Colorado" | "Asset Manager Tenneesse" | "Asset Manager Texas" | "Austin Foreman" | "Colorado Foreman" | "Equipment RM Manager" | "Fleet RM Manager" | "Marketing Event Items" | "Safety Manager Colorado" | "Tennessee Foreman" | "TX Equipment/Fleet Manager";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    location: string;
    status: "Active" | "Inactive";
    avatar: string;
}

interface AppState {
    inventory: ToolItem[];
    transactions: Transaction[];
    users: User[];
    checkInTool: (id: string, user?: string) => void;
    checkOutTool: (id: string, location: string, user?: string) => void;
    changeCondition: (id: string, condition: string) => void;
    bulkImportTools: (tools: ToolItem[]) => void;
    deleteTool: (id: string, user?: string) => void;
    clearAllTools: (user?: string) => void;
    addTool: (tool: ToolItem) => void;
    updateUserRole: (id: string, role: UserRole) => void;
    updateUserStatus: (id: string, status: "Active" | "Inactive") => void;
    initFromServer: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            inventory: initialInventory as ToolItem[],
            transactions: [
                { image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&q=80", asset: "Greenlee Bender #45", action: "Check-In", status: "success", proj: "Data Center B", user: "Jane Smith", time: new Date(Date.now() - 10 * 60000).toISOString() },
                { image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=100&q=80", asset: "Milwaukee Drill HX-2", action: "Field Transfer", status: "transfer", proj: "Hospital Phase 1", user: "Mike T. -> John D.", time: new Date(Date.now() - 42 * 60000).toISOString() },
                { image: "https://images.unsplash.com/photo-1580983546594-c1adbbba72b4?w=100&q=80", asset: "Fluke Multimeter #12", action: "Check-Out", status: "checkout", proj: "Data Center B", user: "Randy", time: new Date(Date.now() - 60 * 60000).toISOString() },
                { image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=100&q=80", asset: "Hilti Rotary Hammer", action: "Flagged", status: "alert", proj: "Iowa Hub", user: "Brady C.", time: new Date(Date.now() - 120 * 60000).toISOString() },
                { image: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?w=100&q=80", asset: "Job Box #8", action: "Check-Out", status: "checkout", proj: "Texas Hub", user: "Sarah L.", time: new Date(Date.now() - 240 * 60000).toISOString() },
                { image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&q=80", asset: "Cable Puller 3K", action: "Flagged", status: "alert", proj: "Colorado Springs", user: "Dave W.", time: new Date(Date.now() - 300 * 60000).toISOString() },
            ],
            users: [
                { id: "u-1", name: "System Admin", email: "admin@loenbro.com", role: "System Admin", location: "Global", status: "Active", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SA" },
                { id: "u-2", name: "Jane Smith", email: "j.smith@loenbro.com", role: "Asset Manager Colorado", location: "Denver Pre-Fab Hub", status: "Active", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JS" },
                { id: "u-3", name: "John Doe", email: "j.doe@loenbro.com", role: "Colorado Foreman", location: "Hospital Phase 1", status: "Active", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JD" },
                { id: "u-4", name: "Mike T.", email: "m.t@loenbro.com", role: "Fleet RM Manager", location: "In Transit", status: "Active", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MT" },
                { id: "u-5", name: "Sarah L.", email: "s.l@loenbro.com", role: "Austin Foreman", location: "Texas Hub", status: "Active", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SL" },
                { id: "u-6", name: "Dave W.", email: "d.w@loenbro.com", role: "Tennessee Foreman", location: "Colorado Springs", status: "Inactive", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DW" },
            ],
            checkInTool: (id, user) => {
                let finalUser = user;
                set((state) => {
                    finalUser = finalUser || state.users?.[0]?.name || "System Admin";
                    const item = state.inventory.find(i => i.id === id);
                    if (!item) return state;

                    const newTx: Transaction = {
                        image: item.image,
                        asset: item.name,
                        action: "Check-In",
                        status: "success",
                        proj: "Warehouse A",
                        user: finalUser,
                        time: new Date().toISOString()
                    };
                    return {
                        inventory: state.inventory.map(i => i.id === id ? { ...i, status: "Available", location: "Warehouse A" } : i),
                        transactions: [newTx, ...state.transactions]
                    };
                });
                if (finalUser) checkInAction(id, finalUser).catch(console.error);
            },
            checkOutTool: (id, location, user) => {
                let finalUser = user;
                set((state) => {
                    finalUser = finalUser || state.users?.[0]?.name || "System Admin";
                    const item = state.inventory.find(i => i.id === id);
                    if (!item) return state;

                    const newTx: Transaction = {
                        image: item.image,
                        asset: item.name,
                        action: "Check-Out",
                        status: "checkout",
                        proj: location,
                        user: finalUser,
                        time: new Date().toISOString()
                    };
                    return {
                        inventory: state.inventory.map(i => i.id === id ? { ...i, status: "Checked Out", location } : i),
                        transactions: [newTx, ...state.transactions]
                    };
                });
                if (finalUser) checkOutAction(id, location, finalUser).catch(console.error);
            },

            changeCondition: (id, condition) => {
                set((state) => {
                    const item = state.inventory.find(i => i.id === id);
                    if (!item) return state;

                    let action = "Flagged";
                    let mstatus: any = "alert";
                    if (condition === "Good") {
                        action = "Repaired";
                        mstatus = "success";
                    }

                    const newTx: Transaction = {
                        image: item.image,
                        asset: item.name,
                        action: action,
                        status: mstatus,
                        proj: item.location,
                        user: state.users?.[0]?.name || "System Admin",
                        time: new Date().toISOString()
                    };

                    return {
                        inventory: state.inventory.map(i => i.id === id ? { ...i, condition } : i),
                        transactions: [newTx, ...state.transactions]
                    };
                });
                updateConditionAction(id, condition, useAppStore.getState().users?.[0]?.name || "System Admin").catch(console.error);
            },
            bulkImportTools: (importedTools) => {
                set((state) => {
                    const newTx: Transaction = {
                        image: "https://images.unsplash.com/photo-1580983546594-c1adbbba72b4?w=100&q=80",
                        asset: "Bulk CSV Import",
                        action: "Imported",
                        status: "success",
                        proj: "Warehouse A",
                        user: state.users?.[0]?.name || "System Admin",
                        time: new Date().toISOString()
                    };

                    return {
                        inventory: [...importedTools, ...state.inventory],
                        transactions: [newTx, ...state.transactions]
                    };
                });
                bulkImportAction(importedTools).catch(console.error);
            },
            updateUserRole: (id, role) => set((state) => ({
                users: state.users.map(u => u.id === id ? { ...u, role } : u)
            })),
            updateUserStatus: (id, status) => set((state) => ({
                users: state.users.map(u => u.id === id ? { ...u, status } : u)
            })),
            addTool: (tool) => {
                set((state) => {
                    const newTx: Transaction = {
                        image: tool.image,
                        asset: tool.name,
                        action: "Registered",
                        status: "success",
                        proj: tool.location,
                        user: state.users?.[0]?.name || "System Admin",
                        time: new Date().toISOString()
                    };

                    return {
                        inventory: [tool, ...state.inventory],
                        transactions: [newTx, ...state.transactions]
                    };
                });
                addToolAction(tool).catch(console.error);
            },
            initFromServer: async () => {
                const state = useAppStore.getState();
                await seedInitialData(state.inventory, state.transactions);

                const inventoryData = await fetchInventory();
                const txData = await fetchTransactions();

                const mappedInventory = inventoryData.map((t: any) => ({
                    id: t.customId,
                    name: t.name,
                    category: t.category,
                    image: t.image,
                    status: t.status,
                    location: t.location,
                    condition: t.condition
                }));

                set({ inventory: mappedInventory, transactions: txData as any[] });
            },
            deleteTool: (id, user) => {
                let finalUser = user;
                set((state) => {
                    finalUser = finalUser || state.users?.[0]?.name || "System Admin";
                    const item = state.inventory.find(i => i.id === id);
                    if (!item) return state;

                    const newTx: Transaction = {
                        image: item.image,
                        asset: item.name,
                        action: "Deleted",
                        status: "alert",
                        proj: item.location,
                        user: finalUser,
                        time: new Date().toISOString()
                    };

                    return {
                        inventory: state.inventory.filter(i => i.id !== id),
                        transactions: [newTx, ...state.transactions]
                    };
                });
                if (finalUser) deleteToolAction(id, finalUser).catch(console.error);
            },
            clearAllTools: (user) => {
                let finalUser = user;
                set((state) => {
                    finalUser = finalUser || state.users?.[0]?.name || "System Admin";
                    const newTx: Transaction = {
                        image: "https://images.unsplash.com/photo-1580983546594-c1adbbba72b4?w=100&q=80",
                        asset: "All Assets",
                        action: "System Purge",
                        status: "alert",
                        proj: "Global",
                        user: finalUser,
                        time: new Date().toISOString()
                    };

                    return {
                        inventory: [],
                        transactions: [newTx, ...state.transactions]
                    };
                });
                if (finalUser) clearAllToolsAction(finalUser).catch(console.error);
            }
        }),
        {
            name: 'loenbro-tool-hub-storage-v5',
        }
    ));
