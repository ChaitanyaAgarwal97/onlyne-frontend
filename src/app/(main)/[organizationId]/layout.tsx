import DashBoardNavBar from "@/components/dashboard/DashBoardNavBar";
import DashBoardSideNavBar from "@/components/dashboard/DashBoardSideNavBar";
import React from "react";

export default function DashBoardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DashBoardNavBar />
            <DashBoardSideNavBar />
            <main className="h-full md:pl-16 md:pt-24">
                {children}
            </main>
        </>
    );
}