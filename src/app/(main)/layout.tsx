import DashBoardNavBar from "@/components/dashboard/DashBoardNavBar";
import React from "react";

export default function DashBoardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DashBoardNavBar />
            {children}
        </>
    );
}