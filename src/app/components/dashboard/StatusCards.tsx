import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import React from "react";

export default function StatusCard({ cardTitleIcon, cardTitleBgColor, children }: { cardTitleIcon: React.ReactNode, cardTitleBgColor?: string, children: React.ReactNode }) {
    return (
        <Card className="h-full bg-[hsl(287,60%,80%)] dark:bg-[hsl(287,60%,10%)] border-0">
            <CardHeader>
                <CardTitle>
                    <div className={`rounded-full w-fit p-4 ${cardTitleBgColor}`}>
                        {cardTitleIcon}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center flex-col">
                {children}
            </CardContent>
        </Card >
    );
}