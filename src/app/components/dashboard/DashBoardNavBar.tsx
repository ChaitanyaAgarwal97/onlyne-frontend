"use client"

import { usePathname } from "next/navigation";
import { ModeToggle } from "@/app/components/providers/mode-toggle";
import { UserButton } from "@clerk/nextjs";


export default function DashBoardNavBar() {
    let path = usePathname();
    path = path.split("/")[2];
    const capitalizedPathStr = path.replace("/", "").replace(/^./, (match) => match.toUpperCase());
    return (
        <nav className={"z-30 md:flex h-20 w-full px-2 bg-[hsl(287,60%,70%)] dark:bg-transparent border-b border-[hsl(287,60%,80%)] dark:border-[hsl(287,60%,90%)]/60 fixed hidden"}>
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
