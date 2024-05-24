"use client"

import { Button } from "@/app/components/ui/button";
import { Trash2 } from "lucide-react";

import { Channel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/use-toast";

export default function ChannelDeleteModalContent({ channel }: { channel: Channel }) {
    const router = useRouter();
    const { toast } = useToast();

    async function deleteButtonHandler() {
        try {
            let res = await fetch(`/api/channels/${channel.id}`, {
                method: "DELETE",
            });

            res = await res.json();

            if (res.message && res.message === "success") {
                toast({
                    variant: "destructive",
                    description: "Channel Deleted",
                })
                return router.refresh();
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="space-y-6">
            <p>Do you really want to delete this channel?</p>
            <Button variant={"destructive"} className="float-right" onClick={deleteButtonHandler}>
                <div className="flex space-x-2 items-center">
                    <Trash2 className="h-6 w-5" />
                    <p>Delete Channel</p>
                </div>
            </Button>
        </div>
    )
}