"use client"
import { Separator } from "@/components/ui/separator";
import { AlignLeft, FolderKanban, LayoutDashboard, MessagesSquare, Users } from "lucide-react";
import ToolTip from "../ToolTip";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/db";

export default function DashBoardSideNavBar({ isOwner }: { isOwner: boolean }) {
    const path = usePathname();
    const organizatonId = path.split("/")[1];

    return (
        <nav className={"h-full z-30 w-16 border-r-[1px] border-[hsl(287,60%,80%)] dark:border-[hsl(287,60%,90%)]/60 p-2 fixed md:top-20 hidden md:flex flex-col"}>
            <ul className="flex flex-col items-center">
                {/* <ToolTip toolTipContent="Toggle navbar">
                    <NavListItem>
                        <AlignLeft size={30} />
                    </NavListItem>
                </ToolTip>
                <Separator /> */}
                {isOwner && <ToolTip toolTipContent="DashBoard">
                    <div>
                        <NavListItem href={`/${organizatonId}/dashboard`} path={path}>
                            <LayoutDashboard size={30} />
                        </NavListItem>
                    </div>
                </ToolTip>}
                {/* <ToolTip toolTipContent="Employees">
                    <div>
                        <NavListItem href={`/${organizatonId}/employees`} path={path}>
                            <Users size={30} />
                        </NavListItem>
                    </div>
                </ToolTip> */}
                <ToolTip toolTipContent="Chats">
                    <div>
                        <NavListItem href={`/${organizatonId}/chats`} path={path}>
                            <MessagesSquare size={30} />
                        </NavListItem>
                    </div>
                </ToolTip>
                <ToolTip toolTipContent="Projects">
                    <div>
                        <NavListItem href={`/${organizatonId}/projects`} path={path}>
                            <FolderKanban size={30} />
                        </NavListItem>
                    </div>
                </ToolTip>
            </ul>
        </nav>
    );
}

function NavListItem({ children, href, path }: { children: React.ReactNode, href?: Url | null, path: string }) {
    return (
        <li className="my-2">
            {href &&
                <div className="flex">
                    <Link href={href} scroll={false} className={cn("group rounded-lg bg-[hsl(287,60%,80%)] hover:bg-[hsl(287,60%,85%)] dark:bg-[hsl(287,60%,10%)] dark:hover:bg-[hsl(287,60%,15%)] p-2 cursor-pointer flex items-center", path != href.toString() && "hover:rounded-full")}>
                        <div className={cn(path == href?.toString() ? "h-[30px]" : "h-[8px]", path != href?.toString() && "group-hover:h-[20px]", "dark:bg-white bg-black w-[4px] ml-2 absolute right-0 rounded-r-full")} />
                        {children}
                    </Link>
                </div>
            }
            {!href && <div className="rounded-lg hover:rounded-full bg-[hsl(287,60%,80%)] hover:bg-[hsl(287,60%,85%)] dark:bg-[hsl(287,60%,10%)] dark:hover:bg-[hsl(287,60%,15%)] p-2 cursor-pointer">{children}</div>}
        </li>
    );
}
