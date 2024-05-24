import { Modal } from "@/app/components/Modal";
import CreateOrganizationForm from "@/app/components/organization/CreateOrganizationForm";
import { prisma } from "@/db";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { EmployeeStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function CreateOrganizationPage() {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

    const employee = await prisma.employee.findFirst({
        where: {
            profileId: userId,
        }
    })

    if (employee && employee.status !== EmployeeStatus.EXEMPLOYEE) return redirect(`/${employee.organizationId}/dashboard`);

    return (
        <div className="h-full">
            <div className="float-right p-4">
                <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                        avatarBox: "h-9 w-9"
                    }
                }} />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full space-y-3 text-xl">
                <p>You are not part of any organization. Create one or ask your employer to add you in one.</p>
                <Modal title="Create Organization" form={<CreateOrganizationForm />} contentClasses="md:h-fit">Create Organization</Modal>
            </div>
        </div>
    );
}