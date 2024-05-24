import { Modal } from "@/app/components/Modal";
import { ApplicantDataTable } from "@/app/components/applicants/ApplicantDataTable/ApplicantDataTable";
import { columns } from "@/app/components/applicants/ApplicantDataTable/ColumnDefinition";
import { ApplicantForm } from "@/app/components/applicants/ApplicantForm";
import { Button } from "@/app/components/ui/button";
import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server"
import { Applicant, Role } from "@prisma/client";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ApplicantsPage({ params }: { params: { organizationId: string } }) {
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
    const isHr = employee?.role === Role.HR;

    if (!isOwner && !isHr) return redirect("/createOrganization")

    let applicants: Applicant[] = [];
    if (isHr) {
        applicants = await prisma.applicant.findMany({
            where: {
                organizationId: params.organizationId,
                createdById: employee.id
            }
        })
    }

    if (isOwner) {
        applicants = await prisma.applicant.findMany({
            where: {
                organizationId: params.organizationId,
            }
        })
    }

    return (
        <div className="h-full flex-1 bg-[hsl(287,60%,11%)] flex flex-col">
            <div className="w-full py-4 px-6 flex justify-end">
                <Modal contentClasses="h-[90%]" title="New Applicant" trigger={<Button className="flex items-center space-x-2 bg-[hsl(123,60%,70%)]"><Plus className="h-8 w-8" /><p>New Applicant</p></Button>} form={<ApplicantForm />} />
            </div>
            <div className="w-full px-6">
                <ApplicantDataTable data={applicants} columns={columns} />
            </div>
        </div>
    )
}