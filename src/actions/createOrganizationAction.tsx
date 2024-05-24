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

    // Adding owner as employee
    const employee = await prisma.employee.create({
        data: {
            doj: new Date(),
            designation: "Owner",
            office: "All",
            idCardImageUrl: "",
            role: "OWNER",
            profileId: userId,
            organizationId: organization.id,
        }
    })

    if (!employee.id) {
        return {
            issues: ['Something went wrong'],
            fields: parsed.data,
        }
    }

    console.log(employee.id);

    // General channel added to organization channels list
    const channel = await prisma.channel.create({
        data: {
            name: "general",
            createdById: employee.id,
            organizationId: organization.id,
        },
    });

    return {
        issues: [],
        message: "success",
        organizationId: organization.id,
    }
}