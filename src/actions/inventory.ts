"use server";

import { db } from "@/lib/firebaseAdmin";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { initialInventory } from "@/lib/mockData";

const IdSchema = z.string().min(1, "ID is required").max(100);
const LocationSchema = z.string().min(1, "Location is required").max(200);
const ConditionSchema = z.string().min(1).max(100);

const ToolObjSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    category: z.string().min(1),
    image: z.string().optional(),
    status: z.string().min(1),
    location: z.string().min(1),
    condition: z.string().min(1)
});

const getImageForAsset = (cat: string, name: string) => {
    const text = (String(cat) + " " + String(name)).toLowerCase();
    if (text.includes("drill") || text.includes("impact") || text.includes("auger")) return "https://plus.unsplash.com/premium_photo-1753026614895-f0b5b8eaef2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGV3YWx0JTIwZHJpbGx8ZW58MHx8fHwxNzcyODMxMTczfDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("saw") || text.includes("blade")) return "https://plus.unsplash.com/premium_photo-1663133625047-4dd73fb92976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2lyY3VsYXIlMjBzYXd8ZW58MHx8fHwxNzcyODMwNjM1fDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("generator") || text.includes("power supply") || text.includes("motor")) return "https://plus.unsplash.com/premium_photo-1671439135739-96bbe677c38c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cG9ydGFibGUlMjBnZW5lcmF0b3J8ZW58MHx8fHwxNzcyODMxMTc0fDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("compressor") || text.includes("pneumatic") || text.includes("air tool")) return "https://plus.unsplash.com/premium_photo-1682210260765-8fd414be79cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YWlyJTIwY29tcHJlc3NvciUyMGNvbnN0cnVjdGlvbnxlbnwwfHx8fDE3NzI4MzExNzR8MA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("ladder") || text.includes("scaffold") || text.includes("step")) return "https://plus.unsplash.com/premium_photo-1663088627718-bec1336c6392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwbGFkZGVyfGVufDB8fHx8MTc3MjgzMTE3NXww&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("weld") || text.includes("torch") || text.includes("plasma")) return "https://plus.unsplash.com/premium_photo-1677172409593-0d0674ac69b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2VsZGluZyUyMHNwYXJrc3xlbnwwfHx8fDE3NzI4MzExNzV8MA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("hvac") || text.includes("fan") || text.includes("heater")) return "https://plus.unsplash.com/premium_photo-1682370891566-5cbca1ae3b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aHZhYyUyMHRvb2xzfGVufDB8fHx8MTc3MjgzMTE3Nnww&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("crimp") || text.includes("cut") || text.includes("strip") || text.includes("plier") || text.includes("die") || text.includes("bend") || text.includes("shoe") || text.includes("knockout")) return "https://plus.unsplash.com/premium_photo-1723874412055-69870e5746c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGxpZXJzfGVufDB8fHx8MTc3MjgzMTE3Nnww&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("multimeter") || text.includes("test") || text.includes("measure") || text.includes("fluke")) return "https://plus.unsplash.com/premium_photo-1723921228640-7e9bb9cb2cfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGlnaXRhbCUyMG11bHRpbWV0ZXJ8ZW58MHx8fHwxNzcyODMxMTc3fDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("lift") || text.includes("heavy") || text.includes("forklift") || text.includes("boom") || text.includes("hoist")) return "https://plus.unsplash.com/premium_photo-1661957532934-400acebc71b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwYm9vbSUyMGxpZnR8ZW58MHx8fHwxNzcyODMxMTc4fDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("safe") || text.includes("ppe") || text.includes("harness") || text.includes("fall")) return "https://plus.unsplash.com/premium_photo-1664301191471-0dc137e504bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwc2FmZXR5JTIwaGFybmVzc3xlbnwwfHx8fDE3NzI4MzExNzl8MA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("hammer") || text.includes("mallet") || text.includes("demo")) return "https://plus.unsplash.com/premium_photo-1723651228034-58b60c613964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2xlZGdlJTIwaGFtbWVyfGVufDB8fHx8MTc3MjgzMTE3OXww&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("wrench") || text.includes("socket") || text.includes("ratchet") || text.includes("torque") || text.includes("pump") || text.includes("valve") || text.includes("hose")) return "https://plus.unsplash.com/premium_photo-1663090072552-46099749ab96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c29ja2V0JTIwd3JlbmNofGVufDB8fHx8MTc3MjgzMTE4MHww&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("screw") || text.includes("driver")) return "https://plus.unsplash.com/premium_photo-1723867304554-a725c4a91b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2NyZXdkcml2ZXJ8ZW58MHx8fHwxNzcyODMxMTgwfDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("paint") || text.includes("spray")) return "https://plus.unsplash.com/premium_photo-1663047450953-2251c9d5f2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGFpbnQlMjBzcHJheSUyMGd1biUyMHRvb2x8ZW58MHx8fHwxNzcyODMxMTgxfDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("fleet") || text.includes("truck") || text.includes("vehicle") || text.includes("trailer") || text.includes("auto")) return "https://plus.unsplash.com/premium_photo-1730500169149-f505e3d0b792?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwcGlja3VwJTIwdHJ1Y2t8ZW58MHx8fHwxNzcyODMxMTgyfDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("light") || text.includes("lamp") || text.includes("led")) return "https://plus.unsplash.com/premium_photo-1678766819199-5660bab7085b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwd29yayUyMGxpZ2h0JTIwZ2VuZXJhdG9yfGVufDB8fHx8MTc3MjgzMTE4M3ww&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("storage") || text.includes("box") || text.includes("gangbox") || text.includes("cabinet") || text.includes("shelv")) return "https://plus.unsplash.com/premium_photo-1750594942636-1aad593584d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dG9vbCUyMGJveCUyMHN0b3JhZ2V8ZW58MHx8fHwxNzcyODMwNjU1fDA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("survey") || text.includes("laser") || text.includes("level") || text.includes("transit") || text.includes("opti")) return "https://plus.unsplash.com/premium_photo-1674340235380-84bb19da5865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c3VydmV5b3IlMjBsZXZlbHxlbnwwfHx8fDE3NzI4MzExODR8MA&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("broom") || text.includes("clean") || text.includes("vac") || text.includes("sweep") || text.includes("janit")) return "https://plus.unsplash.com/premium_photo-1712416360822-286addd963e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cHVzaCUyMGJyb29tfGVufDB8fHx8MTc3MjgzMTE4NHww&ixlib=rb-4.1.0&q=80&w=400";
    if (text.includes("grinder") || text.includes("abrasive")) return "https://plus.unsplash.com/premium_photo-1682147470728-07d41b46b5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YW5nbGUlMjBncmluZGVyJTIwdG9vbCUyMHNwYXJrc3xlbnwwfHx8fDE3NzI4MzExODV8MA&ixlib=rb-4.1.0&q=80&w=400";

    return "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?w=500&q=80";
};

export async function fetchInventory() {
    try {
        const toolsRef = db.collection('tools');
        const snapshot = await toolsRef.orderBy('createdAt', 'desc').get();
        
        const tools = snapshot.docs.map(doc => {
            const data = doc.data();
            // Handle possibility that createdAt is not a Timestamp
            let parsedDate = new Date();
            if (data.createdAt) {
                if (typeof data.createdAt.toDate === "function") {
                    parsedDate = data.createdAt.toDate();
                } else {
                    parsedDate = new Date(data.createdAt);
                }
            }

            return {
                id: doc.id,
                customId: data.customId,
                name: data.name,
                category: data.category,
                image: data.image,
                status: data.status,
                location: data.location,
                condition: data.condition,
                createdAt: parsedDate
            };
        });

        return tools;
    } catch (e: any) {
        console.error("Firebase Inventory Read Error (Quota Exceeded):", e);
        // Fallback to initialInventory for UI resilience during quota limits
        return initialInventory.map(item => ({
            ...item,
            customId: item.id,
            createdAt: new Date()
        }));
    }
}

export async function fetchTransactions() {
    try {
        const txRef = db.collection('transactions');
        const snapshot = await txRef.orderBy('createdAt', 'desc').limit(50).get();
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            let parsedDate = new Date();
            if (data.createdAt) {
                if (typeof data.createdAt.toDate === "function") {
                    parsedDate = data.createdAt.toDate();
                } else {
                    parsedDate = new Date(data.createdAt);
                }
            }

            return {
                id: doc.id,
                toolId: data.toolId,
                image: data.image,
                asset: data.asset,
                action: data.action,
                status: data.status,
                proj: data.proj,
                user: data.user,
                time: data.time,
                createdAt: parsedDate
            };
        });
    } catch (e: any) {
        console.error("Firebase Transactions Read Error:", e);
        // Minimal fallback to keep UI running during quota
        return [
            { id: "TX-1", toolId: "T-1002", image: "https://plus.unsplash.com/premium_photo-1753026614895-f0b5b8eaef2c?w=400", asset: "Bulk CSV Import", action: "Imported", status: "success", proj: "System Default", user: "Admin", time: new Date().toISOString(), createdAt: new Date() }
        ];
    }
}

export async function seedInitialData(tools: any[], initialTransactions: any[]) {
    try {
        const snapshot = await db.collection('tools').limit(1).get();
        if (!snapshot.empty) return { success: true };

        const batch = db.batch();

        const uniqueTools = Array.from(new Map(tools.map((t) => [t.id, t])).values());
        for (const tool of uniqueTools) {
            const ref = db.collection('tools').doc(String(tool.id));
            batch.set(ref, {
                customId: String(tool.id),
                name: String(tool.name),
                category: String(tool.category),
                image: String(tool.image),
                status: String(tool.status),
                location: String(tool.location),
                condition: String(tool.condition),
                createdAt: new Date()
            });
        }

        for (const tx of initialTransactions) {
            const ref = db.collection('transactions').doc();
            batch.set(ref, {
                image: tx.image || "",
                asset: tx.asset,
                action: tx.action,
                status: tx.status,
                proj: tx.proj,
                user: tx.user,
                time: tx.time,
                createdAt: new Date()
            });
        }

        await batch.commit();
        return { success: true };
    } catch (e: any) {
        console.log("Firebase seeding skipped due to Quota Exceeded error.");
        return { success: true }; // Continue initialization even if seeding fails
    }
}

export async function checkOutAction(customIdRaw: string, locationRaw: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const customId = IdSchema.parse(customIdRaw);
    const location = LocationSchema.parse(locationRaw);
    const user = session.user?.name || session.user?.email || "Unknown User";

    const toolRef = db.collection('tools').doc(customId);
    const doc = await toolRef.get();
    if (!doc.exists) return null;
    const tool = doc.data()!;

    await toolRef.update({
        status: "Checked Out",
        location: location
    });

    const txRef = db.collection('transactions').doc();
    await txRef.set({
        toolId: customId,
        image: tool.image,
        asset: tool.name,
        action: "Check-Out",
        status: "checkout",
        proj: location,
        user,
        time: new Date().toISOString(),
        createdAt: new Date()
    });

    return { updated: true, tx: true };
}

export async function checkInAction(customIdRaw: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const customId = IdSchema.parse(customIdRaw);
    const user = session.user?.name || session.user?.email || "Unknown User";

    const toolRef = db.collection('tools').doc(customId);
    const doc = await toolRef.get();
    if (!doc.exists) return null;
    const tool = doc.data()!;

    await toolRef.update({
        status: "Available",
        location: "Warehouse A"
    });

    const txRef = db.collection('transactions').doc();
    await txRef.set({
        toolId: customId,
        image: tool.image,
        asset: tool.name,
        action: "Check-In",
        status: "success",
        proj: "Warehouse A",
        user,
        time: new Date().toISOString(),
        createdAt: new Date()
    });

    return { updated: true, tx: true };
}

export async function updateConditionAction(customIdRaw: string, conditionRaw: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const customId = IdSchema.parse(customIdRaw);
    const condition = ConditionSchema.parse(conditionRaw);
    const user = session.user?.name || session.user?.email || "Unknown User";

    const toolRef = db.collection('tools').doc(customId);
    const doc = await toolRef.get();
    if (!doc.exists) return null;
    const tool = doc.data()!;

    await toolRef.update({ condition });

    let action = "Flagged";
    let mstatus = "alert";
    if (condition === "Good") {
        action = "Repaired";
        mstatus = "success";
    }

    const txRef = db.collection('transactions').doc();
    await txRef.set({
        toolId: customId,
        image: tool.image,
        asset: tool.name,
        action,
        status: mstatus,
        proj: tool.location,
        user,
        time: new Date().toISOString(),
        createdAt: new Date()
    });

    return { updated: true, tx: true };
}

export async function bulkImportAction(newTools: any[]) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");
    const user = session.user?.name || session.user?.email || "Unknown User";

    const batch = db.batch();

    for (const t of newTools) {
        const customId = String(t.id);
        const ref = db.collection('tools').doc(customId);
        batch.set(ref, {
            customId: customId,
            name: String(t.name),
            category: String(t.category),
            image: String(t.image),
            status: String(t.status),
            location: String(t.location),
            condition: String(t.condition),
            createdAt: new Date()
        }, { merge: true });
    }

    const txRef = db.collection('transactions').doc();
    batch.set(txRef, {
        image: "https://images.unsplash.com/photo-1580983546594-c1adbbba72b4?w=100&q=80",
        asset: "Bulk CSV Import",
        action: "Imported",
        status: "success",
        proj: "Warehouse A",
        user: user,
        time: new Date().toISOString(),
        createdAt: new Date()
    });

    await batch.commit();
    return { success: true };
}

export async function deleteToolAction(customIdRaw: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "Admin") {
        throw new Error("Unauthorized: Admin privileges required to delete assets.");
    }

    const customId = IdSchema.parse(customIdRaw);
    const user = session.user?.name || session.user?.email || "Unknown User";

    const toolRef = db.collection('tools').doc(customId);
    const doc = await toolRef.get();
    if (!doc.exists) return null;
    const tool = doc.data()!;

    await toolRef.delete();

    const txRef = db.collection('transactions').doc();
    await txRef.set({
        toolId: customId,
        image: tool.image,
        asset: tool.name,
        action: "Deleted",
        status: "alert",
        proj: tool.location,
        user,
        time: new Date().toISOString(),
        createdAt: new Date()
    });

    return { deleted: true, tx: true };
}

export async function clearAllToolsAction() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "Admin") {
        throw new Error("CRITICAL UNAUTHORIZED: Valid Admin session required to purge database.");
    }

    const snapshot = await db.collection('tools').get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    const txRef = db.collection('transactions').doc();
    batch.set(txRef, {
        image: "https://images.unsplash.com/photo-1580983546594-c1adbbba72b4?w=100&q=80",
        asset: "All Assets",
        action: "System Purge",
        status: "alert",
        proj: "Global",
        user: session.user?.name || session.user?.email || "Admin User",
        time: new Date().toISOString(),
        createdAt: new Date()
    });

    await batch.commit();

    return { success: true, count: snapshot.size };
}

export async function addToolAction(toolObjRaw: any) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const toolObj = ToolObjSchema.parse(toolObjRaw);
    const user = session.user?.name || session.user?.email || "Unknown User";

    const newImage = getImageForAsset(toolObj.category, toolObj.name);
    try {
        const toolRef = db.collection('tools').doc(toolObj.id);
        const data = {
            customId: toolObj.id,
            name: toolObj.name,
            category: toolObj.category,
            image: newImage,
            status: toolObj.status,
            location: toolObj.location,
            condition: toolObj.condition,
            createdAt: new Date()
        };
        await toolRef.set(data);

        const txRef = db.collection('transactions').doc();
        await txRef.set({
            toolId: toolObj.id,
            image: newImage,
            asset: toolObj.name,
            action: "Registered",
            status: "success",
            proj: "Warehouse",
            user,
            time: new Date().toISOString(),
            createdAt: new Date()
        });

        return { success: true, tool: data, tx: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: e };
    }
}
