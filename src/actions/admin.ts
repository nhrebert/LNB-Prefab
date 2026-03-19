"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const BrandingSchema = z.object({
    companyName: z.string().min(1).max(200),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
    secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color")
});

const SSOSchema = z.object({
    ssoProvider: z.string().min(1).max(50),
    ssoClientId: z.string().max(255).optional(),
    ssoDomain: z.string().max(255).optional(),
    ssoEnabled: z.boolean()
});

const prisma = new PrismaClient();

export async function getSystemSettings() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error("Unauthorized access. Admin privileges required.");
        }

        let settings = await (prisma as any).systemSettings.findUnique({
            where: { id: "global" }
        });

        if (!settings) {
            settings = await (prisma as any).systemSettings.create({
                data: {
                    id: "global",
                    companyName: "Loenbro Tool Hub",
                    primaryColor: "#FF6B00",
                    secondaryColor: "#13406A",
                    logoUrl: "/loenbro-logo.png",
                    ssoProvider: "microsoft",
                    ssoEnabled: false
                }
            });
        }
        return settings;
    } catch (error) {
        console.error("Failed to get system settings:", error);
        return null;
    }
}

export async function updateBranding(dataRaw: { companyName: string, primaryColor: string, secondaryColor: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "Admin") {
            throw new Error("Unauthorized: Admin privileges required to update branding.");
        }

        const data = BrandingSchema.parse(dataRaw);
        await (prisma as any).systemSettings.update({
            where: { id: "global" },
            data: {
                companyName: data.companyName,
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor
            }
        });
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update branding:", error);
        return { success: false, error: "Failed to update branding. " };
    }
}

export async function updateSSO(dataRaw: { ssoProvider: string, ssoClientId: string, ssoDomain: string, ssoEnabled: boolean }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "Admin") {
            throw new Error("Unauthorized: Admin privileges required to update SSO settings.");
        }

        const data = SSOSchema.parse(dataRaw);
        await (prisma as any).systemSettings.update({
            where: { id: "global" },
            data: {
                ssoProvider: data.ssoProvider,
                ssoClientId: data.ssoClientId,
                ssoDomain: data.ssoDomain,
                ssoEnabled: data.ssoEnabled
            }
        });
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update SSO:", error);
        return { success: false, error: "Failed to update SSO settings. " };
    }
}
