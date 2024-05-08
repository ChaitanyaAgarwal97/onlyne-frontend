"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Url } from "next/dist/shared/lib/router/router";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/providers/mode-toggle";
import { UserButton } from "@clerk/nextjs";


export default function DashBoardNavBar() {
    const path = usePathname();
    return (
        <nav className={"flex h-20 w-full px-56 bg-[hsl(287,60%,90%)] dark:bg-transparent"}>
            <div className={"w-1/6 text-2xl font-bold flex justify-end items-center"}>
                OnLyne
            </div>
            <div className={"w-4/6"}>
                <ul className={"list-none flex justify-center space-x-7 items-center h-full text-md"}>
                    <li>
                        <NavBarButton variant={path === "/dashboard" ? "primary" : "transparent"} href="/dashboard">Dashboard</NavBarButton>
                    </li>
                    <li>
                        <NavBarButton variant={path === "/chats" ? "primary" : "transparent"} href="/chats">Chats</NavBarButton>
                    </li>
                    <li>
                        <NavBarButton variant={path === "/projects" ? "primary" : "transparent"} href="/projects">Projects</NavBarButton>
                    </li>
                </ul>
            </div>
            <div className={"w-1/6 flex justify-end items-center"} >
                <ModeToggle />
                <span className={"mx-5"} />
                <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                        avatarBox: "h-9 w-9"
                    }
                }} />
            </div>
        </nav >
    );
}


function NavBarButton({ children, variant, href }: { children: React.ReactNode, variant: "transparent" | "primary", href: Url }) {
    return (
        <Button variant={variant} className={"rounded-3xl px-8"}>
            <Link href={href} >
                {children}
            </Link>
        </Button>
    );
}