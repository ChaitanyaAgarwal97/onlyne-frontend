"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Url } from "next/dist/shared/lib/router/router";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/providers/mode-toggle";
import { UserButton } from "@clerk/nextjs";


export default function DashBoardNavBar() {
    let path = usePathname();
    path = path.split("/")[2];
    const capitalizedPathStr = path.replace("/", "").replace(/^./, (match) => match.toUpperCase());
    return (
        <nav className={"z-30 md:flex h-20 w-full px-2 bg-[hsl(287,60%,90%)] dark:bg-transparent fixed hidden"}>
            <div className={"w-1/6 text-2xl font-bold flex justify-start items-center"}>
                OnLyne
            </div>
            <div className={"w-4/6 text-3xl font-bold flex justify-center items-center"}>
                <p>{capitalizedPathStr}</p>
            </div>
            <div className={"w-1/6 flex justify-start items-center"} >
                <ModeToggle />
                <span className={"mx-3"} />
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