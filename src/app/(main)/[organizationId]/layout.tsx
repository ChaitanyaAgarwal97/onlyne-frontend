import DashBoardNavBar from "@/app/components/dashboard/DashBoardNavBar";
import DashBoardSideNavBar from "@/app/components/dashboard/DashBoardSideNavBar";
import MobileDashBoardNavBar from "@/app/components/dashboard/MobileDashBoardNavBar";

import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { EmployeeStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Loading from "./loading";

export default async function DashBoardLayout({ children, params }: { children: React.ReactNode, params: { organizationId: string } }) {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

    const employee = await prisma.employee.findFirst({
        where: {
            profileId: userId,
            organizationId: params.organizationId,
        }
    })

    if (!employee || employee.status === EmployeeStatus.EXEMPLOYEE) return redirect("/createOrganization")

    return (
        <>
            <MobileDashBoardNavBar isOwner={employee.role === Role.OWNER} isHr={employee.role === Role.HR} />
            <DashBoardNavBar />
            <div className="flex h-full">
                <div className="md:w-16 h-full hidden md:block">
                    <DashBoardSideNavBar isOwner={employee.role === Role.OWNER} isHr={employee.role === Role.HR} />
                </div>
                <Suspense fallback={<Loading />}>
                    <main className="h-full md:pt-20 pt-16  flex-1">
                        {children}
                    </main>
                </Suspense>
            </div>
        </>
    );
}