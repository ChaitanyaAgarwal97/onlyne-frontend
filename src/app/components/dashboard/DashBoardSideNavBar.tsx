"use client"
import { Separator } from "@/app/components/ui/separator";
import { AlignLeft, FolderKanban, LayoutDashboard, MessagesSquare, NotebookText, UserRoundMinus, Users } from "lucide-react";
import ToolTip from "../ToolTip";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/db";

export default function DashBoardSideNavBar({ isOwner, isHr }: { isOwner: boolean, isHr: boolean }) {
    const path = usePathname();
    if (!path) return redirect("/createOrganization");
    const organizatonId = path?.split("/")[1];

    return (
        <nav className={"h-full z-30 dark:bg-[hsl(287,60%,7%)] bg-[hsl(287,60%,70%)] p-2 fixed md:top-20 md:flex flex-col"}>
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
                {/* <ToolTip toolTipContent="Projects">
                    <div>
                        <NavListItem href={`/${organizatonId}/projects`} path={path}>
                            <FolderKanban size={30} />
                        </NavListItem>
                    </div>
                </ToolTip> */}
                {(isOwner || isHr) && <ToolTip toolTipContent="Applicants">
                    <div>
                        <NavListItem href={`/${organizatonId}/applicants`} path={path}>
                            <NotebookText size={30} />
                        </NavListItem>
                    </div>
                </ToolTip>}
                <ToolTip toolTipContent="Leaves">
                    <div>
                        <NavListItem href={`/${organizatonId}/leaves`} path={path}>
                            <UserRoundMinus size={30} />
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
                        <div className={cn(path == href?.toString() ? "h-[30px]" : "h-[8px]", path != href?.toString() && "group-hover:h-[20px]", "dark:bg-white bg-black w-[4px] ml-2 absolute left-0 rounded-r-full")} />
                        {children}
                    </Link>
                </div>
            }
            {!href && <div className="rounded-lg hover:rounded-full bg-[hsl(287,60%,80%)] hover:bg-[hsl(287,60%,85%)] dark:bg-[hsl(287,60%,10%)] dark:hover:bg-[hsl(287,60%,15%)] p-2 cursor-pointer">{children}</div>}
        </li>
    );
}
