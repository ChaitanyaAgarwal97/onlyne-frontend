"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/accordion"
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

export default function MobileDashBoardNavBar({ isOwner, isHr }: { isOwner: boolean, isHr: boolean }) {
    let path = usePathname();
    if (!path) return redirect("/createOrganization");
    const organizationId = path.split("/")[1];
    path = path.split("/")[2];
    const capitalizedPathStr = path.replace("/", "").replace(/^./, (match) => match.toUpperCase());

    return (
        <Accordion type="single" collapsible className="z-30 h-16 md:hidden w-full px-4 border-b bg-[hsl(287,60%,70%)] dark:bg-transparent border-[hsl(287,60%,80%)] dark:border-[hsl(287,60%,90%)]/60 fixed">
            <AccordionItem value="navbar" className="border-b-0">
                <AccordionTrigger className="text-2xl flex items-center justify-between hover:no-underline no-underline">{capitalizedPathStr}</AccordionTrigger>
                <AccordionContent className="border-b text-lg w-full py-4 bg-[hsl(287,60%,5%)]">
                    <ul className="list-none space-y-6">
                        {isOwner && <li className="flex justify-center">
                            <Link href={`/${organizationId}/dashboard`} className="hover:no-underline">DashBoard</Link>
                        </li>}
                        <li className="flex justify-center">
                            <Link href={`/${organizationId}/chats`} className="hover:no-underline">Chats</Link>
                        </li>
                        {/* <li className="flex justify-center">
                            <Link href={`/${organizationId}/projects`} className="hover:no-underline">Projects</Link>
                        </li> */}
                        {(isOwner || isHr) && <li className="flex justify-center">
                            <Link href={`/${organizationId}/applicants`} className="hover:no-underline">Applicants</Link>
                        </li>}
                        <li className="flex justify-center">
                            <Link href={`/${organizationId}/leaves`} className="hover:no-underline">Leaves</Link>
                        </li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}