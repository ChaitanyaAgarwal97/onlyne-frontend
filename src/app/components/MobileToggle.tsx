import { Menu } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/app/components/ui/sheet"
import { Button } from "@/app/components/ui/button"
import DashBoardSideNavBar from "@/app/components/dashboard/DashBoardSideNavBar"
import ChatSideNavBar from "@/app/components/chats/ChatSideNavBar"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/db"

export const MobileToggle = async ({ organizationId }: { organizationId: string }) => {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId,
        },
        select: {
            ownerId: true,
        }
    })

    if (!organization) return redirect("/createOrganization");

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0 md:hidden">
                <div className="flex-1">
                    <ChatSideNavBar organizationId={organizationId} />
                </div>
            </SheetContent>
        </Sheet>
    )
}