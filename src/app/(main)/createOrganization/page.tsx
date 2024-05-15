import { Modal } from "@/components/Modal";
import CreateOrganizationForm from "@/components/organization/CreateOrganizationForm";
import { prisma } from "@/db";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateOrganizationPage() {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

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
        select: {
            id: true
        }
    });

    if (organizationData) return redirect(`/${organizationData.id}/dashboard`);

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
                <Modal title="Create Organization" form={<CreateOrganizationForm />}>Create Organization</Modal>
            </div>
        </div>
    );
}