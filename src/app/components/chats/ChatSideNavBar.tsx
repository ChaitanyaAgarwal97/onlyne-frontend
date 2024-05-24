import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Button } from "@/app/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Modal } from "../Modal";
import CreateTeamForm from "./createTeamForm/CreateTeamForm";
import { Separator } from "@/app/components/ui/separator";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import ChannelList from "./channels/ChannelList";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/accordion"


import { prisma } from "@/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function ChatSideNavBar({ organizationId }: { organizationId: string }) {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId,
        },
        include: {
            Employees: {
                where: {
                    NOT: {
                        profileId: userId,
                    }
                },
                include: {
                    profile: true
                }
            },
            Channel: {
                where: {
                    teamId: null
                },
            }
        }
    });

    const teams = await prisma.team.findMany({
        where: {
            TeamMember: {
                some: {
                    employee: {
                        profileId: userId
                    }
                }
            }
        },
        include: {
            Channel: true,
        }
    })

    const userEmployeeData = await prisma.employee.findFirst({
        where: {
            AND: [
                {
                    profileId: userId,
                },
                {
                    organizationId: organizationId,
                }
            ],
        }
    });

    if (!userEmployeeData) return redirect("/createOrganization");

    return (
        <nav className="md:w-72 h-full bg-[hsl(287,60%,80%)] dark:bg-[hsl(287,60%,9%)]  border-[hsl(287,60%,80%)] dark:border-[hsl(287,60%,90%)]/60 py-8 md:py-2 md:flex flex-col">
            {userEmployeeData.role === "OWNER" || userEmployeeData.role === "MANAGER" || userEmployeeData.role === "HR" ? <DropdownMenu>
                <DropdownMenuTrigger asChild className="focus:outline-none outline-none">
                    <Button variant={"transparent"} className="w-full flex justify-between text-md focus:outline-none outline-none">
                        <p>{organization?.name}</p><ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[hsl(287,60%,70%)] dark:bg-[hsl(287,60%,5%)]">
                    <Modal title="Create Team" form={<CreateTeamForm data={organization?.Employees} userId={userId} />} contentClasses="md:max-w-screen-md max-w-screen-sm h-[90%]" trigger={<p className="block w-60 md:inline px-2 py-1 cursor-pointer text-lg md:text-sm dark:hover:bg-[hsl(287,60%,15%)] hover:bg-[hsl(287,60%,80%)] rounded">Create Team</p>} />
                </DropdownMenuContent>
            </DropdownMenu> : <div className="bg-transparent w-full flex justify-between text-md font-bold mx-3 my-2"><p>{organization?.name}</p></div>}

            <Separator className="bg-[hsl(287,60%,95%)] dark:bg-[hsla(287,60%,15%)] my-2 rounded-md" />

            <ScrollArea className="h-[80%]">
                <ChannelList userEmployeeData={userEmployeeData} channels={organization?.Channel} className="my-4" />
                {teams && teams.length !== 0 && teams.map(team => {
                    return (
                        <Accordion key={team.id} type="single" collapsible className="w-full">
                            <AccordionItem value={team.id} className="border-0">
                                <AccordionTrigger className="font-bold hover:no-underline text-sm uppercase dark:text-[hsl(287,60%,40%)] px-2">{team.name}</AccordionTrigger>
                                <AccordionContent>
                                    <ChannelList channels={team.Channel} userEmployeeData={userEmployeeData} teamId={team.id} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )
                })
                }
            </ScrollArea>
        </nav >
    );
}