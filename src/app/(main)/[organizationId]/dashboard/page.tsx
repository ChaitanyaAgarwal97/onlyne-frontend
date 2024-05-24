import IDCard from "@/app/components/dashboard/IDCard";
import StatusCard from "@/app/components/dashboard/StatusCards";
import { DataTable } from "@/app/components/dashboard/employeeDataTable/DataTable"
import { AlarmClockCheck, FileCheck, Plus, Users } from "lucide-react";

import { formatDate, formatNum } from "@/lib/formatter";
import { auth } from "@clerk/nextjs/server";
import { EmployeeDataTable, columns } from "@/app/components/dashboard/employeeDataTable/ColumnDefinition"
import { prisma } from "@/db";
import { redirect } from "next/navigation";

async function countNewEmployees(): Promise<number> {
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const count = await prisma.employee.count({
        where: {
            doj: {
                gte: oneMonthAgo,
                lte: currentDate,
            },
        },
    });

    return count;
}

export default async function DashBoardPage({ params }: { params: { organizationId: string } }) {
    const { userId, redirectToSignIn } = auth();

    if (!userId) {
        return redirectToSignIn();
    }

    const organizationData = await prisma.organization.findFirst({
        where: {
            OR: [
                {
                    ownerId: userId,
                },
                {
                    Employees: {
                        some: {
                            profileId: userId,
                        }
                    }
                }
            ]
        },
        include: {
            Employees: {
                where: {
                    NOT: {
                        role: "OWNER"
                    }
                },
                select: {
                    employeeId: true,
                    profile: {
                        select: {
                            name: true,
                            email: true,
                        }
                    },
                    designation: true,
                    status: true,
                    office: true,
                    doj: true,
                    role: true
                }
            },
            owner: {
                select: {
                    name: true,
                }
            }
        }
    })

    if (!organizationData || organizationData.id !== params.organizationId) {
        return redirect("/createOrganization")
    }

    if (organizationData.ownerId !== userId) return redirect(`/${organizationData.id}/chats`);

    let data: EmployeeDataTable[] = [];
    data = organizationData.Employees.map(employee => {
        return {
            organizationId: "",
            employeeId: employee.employeeId,
            name: employee.profile.name,
            email: employee.profile.email,
            // idCardImageUrl: employee.idCardImageUrl,
            role: employee.role !== "OWNER" ? employee.role : "REGULAR",
            designation: employee.designation,
            status: employee.status,
            office: employee.office,
            doj: formatDate(employee.doj),
        }
    })

    const newEmployees = await countNewEmployees();


    return (
        <div className="container md:px-0 h-full my-4">
            <div className={"md:w-full md:grid md:grid-cols-4 md:grid-row-[repeat(7, 5rem)] lg:grid-cols-5 lg:grid-rows-[repeat(7,5rem)] gap-8 space-y-6 md:space-y-0"} >
                <div className={"col-span-4 text-4xl font-semibold"}>
                    {`Hi, ${organizationData.owner.name}`}
                </div>
                <div className="col-span-1 row-span-3 lg:block hidden">
                    {/* <IDCard /> */}
                </div>
                <div className="row-span-2">
                    <StatusCard cardTitleIcon={<Users size={32} />} cardTitleBgColor="bg-[hsl(55,60%,50%)]">
                        <p className="text-bold text-3xl">{formatNum(data.length)}</p>
                        <p className="text-sm ">Total Employees</p>
                    </StatusCard>
                </div>
                <div className="row-span-2">
                    <StatusCard cardTitleIcon={<FileCheck size={32} />} cardTitleBgColor="bg-[hsl(184,60%,50%)]">
                        <p className="text-bold text-3xl">{formatNum(4342)}</p>
                        <p className="text-sm ">Job Applicants</p>
                    </StatusCard>
                </div>
                <div className="row-span-2">
                    <StatusCard cardTitleIcon={<Plus size={32} />} cardTitleBgColor="bg-[hsl(310,60%,50%)]">
                        <p className="text-bold text-3xl">{formatNum(newEmployees)}</p>
                        <p className="text-sm ">New Employees</p>
                    </StatusCard>
                </div>
                <div className="row-span-2">
                    <StatusCard cardTitleIcon={<AlarmClockCheck size={32} />} cardTitleBgColor="bg-[hsl(125,60%,50%)]">
                        <p className="text-bold text-3xl">{formatNum(4342)}</p>
                        <p className="text-sm ">Projects Completed</p>
                    </StatusCard>
                </div>
                <div className="row-span-2 md:col-span-4 lg:col-span-5">
                    <DataTable data={data} columns={columns} />
                </div>
            </div>
        </div>

    );
}