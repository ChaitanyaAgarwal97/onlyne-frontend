"use server"

import { prisma } from "@/db";
import { OrganizationSchema } from "@/zodSchema/organizationSchema";
import { auth } from "@clerk/nextjs/server";

export type FormState = {
    issues: string[];
    fields?: Record<string, string>;
    message?: string;
    organizationId?: string,
};

export async function createOrganizationAction(prevState: FormState, data: FormData): Promise<FormState> {
    const formData = Object.fromEntries(data);

    const parsed = OrganizationSchema.safeParse(formData);

    if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const key of Object.keys(formData)) {
            fields[key] = formData[key].toString();
        }

        return {
            issues: parsed.error.issues.map((issue) => issue.message),
            fields,
        };
    }

    const { userId } = auth();

    if (!userId) {
        return {
            issues: ["Something went wrong"],
            fields: parsed.data
        }
    }

    const organization = await prisma.organization.create({
        data: {
            name: parsed.data.name,
            ownerId: userId,
        }
    });

    if (!organization.id) {
        return {
            issues: ['Something went wrong'],
            fields: parsed.data,
        }
    }

    return {
        issues: [],
        message: "success",
        organizationId: organization.id,
    }
}