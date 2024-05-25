import { Modal } from "@/app/components/Modal";
import { columns } from "@/app/components/leaves/LeaveDataTable/ColumnDefinition";
import { LeaveDataTable } from "@/app/components/leaves/LeaveDataTable/LeaveDataTable";
import { Leave, LeaveForm } from "@/app/components/leaves/LeaveForm";
import { Button } from "@/app/components/ui/button";
import { prisma } from "@/db";
import { formatDate } from "@/lib/formatter";
import { auth } from "@clerk/nextjs/server"
import { Role } from "@prisma/client";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LeavesPage({ params }: { params: { organizationId: string } }) {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

    const employee = await prisma.employee.findFirst({
        where: {
            profileId: userId,
            organizationId: params.organizationId,
        }
    });

    if (!employee) return redirect("/createOrganization")

    const isOwner = employee?.role === Role.OWNER;
    const isManager = employee?.role === Role.MANAGER;

    let leaves: (Leave & { id: string, appliedBy: string, isManager: boolean, isApplicant: boolean, handledBy?: string })[] = [];
    if (isOwner) {
        const allLeaves = await prisma.leave.findMany({
            include: {
                appliedBy: {
                    include: {
                        profile: true
                    }
                },
                handledBy: {
                    include: {
                        profile: true,
                    }
                },
            }
        });

        leaves = allLeaves.map(leave => (
            {
                reason: leave.reason,
                from: formatDate(leave.from),
                to: formatDate(leave.to),
                rejoinedOn: leave.rejoinedOn ? formatDate(leave.rejoinedOn) : "-",
                status: leave.status,
                id: leave.id,
                appliedBy: leave.appliedBy.profile.email,
                handledBy: leave.handledBy?.profile.email ?? "-",
                isManager: true,
                isApplicant: false,
            }
        ))
    }

    else if (isManager) {
        const allLeaves = await prisma.leave.findMany({
            where: {
                appliedBy: {
                    role: Role.REGULAR,
                }
            },
            include: {
                appliedBy: {
                    include: {
                        profile: true
                    }
                },
                handledBy: {
                    include: {
                        profile: true,
                    }
                },
            }
        });

        leaves = allLeaves.map(leave => (
            {
                reason: leave.reason,
                from: formatDate(leave.from),
                to: formatDate(leave.to),
                rejoinedOn: leave.rejoinedOn ? formatDate(leave.rejoinedOn) : "-",
                status: leave.status,
                id: leave.id,
                appliedBy: leave.appliedBy.profile.email,
                handledBy: leave.handledBy?.profile.email ?? "-",
                isManager: true,
                isApplicant: leave.appliedBy.id === employee.id,
            }
        ))
    } else {
        const allLeaves = await prisma.leave.findMany({
            where: {
                appliedById: employee.id,
            },
            include: {
                appliedBy: {
                    include: {
                        profile: true
                    }
                },
                handledBy: {
                    include: {
                        profile: true,
                    }
                },
            }
        });

        leaves = allLeaves.map(leave => (
            {
                reason: leave.reason,
                from: formatDate(leave.from),
                to: formatDate(leave.to),
                rejoinedOn: leave.rejoinedOn ? formatDate(leave.rejoinedOn) : "-",
                status: leave.status,
                id: leave.id,
                appliedBy: leave.appliedBy.profile.email,
                handledBy: leave.handledBy?.profile.email ?? "-",
                isManager: false,
                isApplicant: true,
            }
        ))
    }

    let totalLeavesTaken = 0;
    if (!isOwner) {
        totalLeavesTaken = await prisma.leave.count({
            where: {
                appliedById: employee.id,
                status: "APPROVED"
            }
        })
    }

    return (
        <div className="h-full flex-1 bg-[hsl(287,60%,11%)] flex flex-col">
            {!isOwner && <div className="w-full py-4 px-6 flex justify-between">
                <p>{`Total Leaves Taken: ${totalLeavesTaken}`}</p>
                <Modal contentClasses="h-[90%]" title="Apply for Leave" trigger={<Button className="flex items-center space-x-2 bg-[hsl(123,60%,70%)]"><Plus className="h-8 w-8" /><p>New Leave</p></Button>} form={<LeaveForm />} />
            </div>}
            <div className="w-full px-6">
                <LeaveDataTable data={leaves} columns={columns} />
            </div>
        </div>
    )
}