import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server"
import { EmployeeStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function ChatsPage({ params, }: {
    params: { organizationId: string },
}) {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

    const organization = await prisma.organization.findFirst({
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
            Channel: {
                where: {
                    name: "general",
                    teamId: null,
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    const employee = await prisma.employee.findFirst({
        where: {
            profileId: userId,
        }
    })

    if (!employee || employee.organizationId !== params.organizationId || employee.status === EmployeeStatus.EXEMPLOYEE) return redirect("/createOrganization");

    const initialChannel = organization?.Channel[0];

    if (initialChannel?.name !== "general") {
        return null;
    }

    return redirect(`/${params.organizationId}/chats/channel/${initialChannel.id}`);
}