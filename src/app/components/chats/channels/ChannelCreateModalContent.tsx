"use client"

import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { CircleX, LoaderCircle } from "lucide-react";
import { ChannelType, Employee } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/use-toast";

export type ChannelData = {
    name: string;
    createdById: string;
    channelType: ChannelType,
    organizationId: string,
    teamId?: string,
}

export default function ChannelCreateModalContent({ userEmployeeData, channelType, teamId }: { userEmployeeData: Employee, channelType: ChannelType, teamId?: string }) {
    const [channelName, setChannelName] = useState<string>();
    const [state, setState] = useState<{ issues: string[] }>({ issues: [] });
    const [isPending, setIsPending] = useState<boolean>(false);

    const { toast } = useToast();

    const router = useRouter();

    async function createButtonHandler() {
        try {
            if (!channelName || channelName === "") return setState({
                issues: ["Name cannot be empty"]
            })
            setIsPending(true)
            const data: ChannelData = {
                name: channelName,
                createdById: userEmployeeData.id,
                channelType: channelType,
                organizationId: userEmployeeData.organizationId,
                teamId: teamId,
            }

            let res = await fetch("/api/channels/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            res = await res.json()

            console.log(res);
            if (res.message && res.message === "success") {
                toast({
                    description: "Channel Created",
                })
                return router.refresh();
            }

            setState({ issues: [res.issues] });
        } catch (error) {
            console.log(error)
        } finally {
            setIsPending(false);
        }
    }

    return (
        <ScrollArea>
            {state?.issues?.length !== 0 &&
                <ul className="text-rose-500">
                    {state?.issues?.map((issue, index) => <li key={`${issue}-${index}`} className="flex space-x-2"><CircleX size={24} /> <span>{issue}</span></li>)}
                </ul>
            }
            <div className="my-4 space-y-2">
                <Label htmlFor="name" className="text-right">
                    Channel Name
                </Label>
                <Input
                    id="name"
                    className="col-span-3"
                    placeholder="Enter Channel Name"
                    onChange={(e) => setChannelName(e.target.value)}
                />
            </div>
            <Button variant={"primary"} className="my-4 float-right" onClick={createButtonHandler} aria-disabled={isPending}>
                {!isPending && <div>Create</div>}
                {isPending && <div className="flex space-x-4 items-center"><LoaderCircle size={28} className="animate-spin" /> <p>Loading...</p></div>}
            </Button>
        </ScrollArea>
    );
}