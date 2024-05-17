import DashBoardNavBar from "@/components/dashboard/DashBoardNavBar";
import DashBoardSideNavBar from "@/components/dashboard/DashBoardSideNavBar";

import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashBoardLayout({ children, params }: { children: React.ReactNode, params: { organizationId: string } }) {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

    const owner = await prisma.organization.findUnique({
        where: {
            id: params.organizationId,
        },
        select: {
            ownerId: true,
        }
    })

    return (
        <>
            <DashBoardNavBar />
            <DashBoardSideNavBar isOwner={owner?.ownerId === userId} />
            <main className="h-full md:pl-16 md:pt-24">
                {children}
            </main>
        </>
    );
}