"use client"

import { Channel, ChannelType, Employee, Role } from "@prisma/client";

import { Hash, Plus, Trash2, Video } from "lucide-react";
import ToolTip from "@/app/components/ToolTip";
import { Modal } from "@/app/components/Modal";
import ChannelDeleteModalContent from "./ChannelDeleteModalContent";
import ChannelCreateModalContent from "./ChannelCreateModalContent";
import { useRouter } from "next/navigation";
import { prisma } from "@/db";

export const ChannelIconType = {
    [ChannelType.TEXT]: <Hash className="h-5 w-5" />,
    [ChannelType.VIDEO]: <Video className="h-5 w-5" />,
}

export default function ChannelList({ channels, className, userEmployeeData, teamId, }: { channels?: Channel[], className?: string, userEmployeeData: Employee, teamId?: string, }) {
    return (
        <div className={className}>
            <ChannelSection teamId={teamId} userEmployeeData={userEmployeeData} channels={channels} sectionType={ChannelType.TEXT} />
            <ChannelSection teamId={teamId} userEmployeeData={userEmployeeData} channels={channels} sectionType={ChannelType.VIDEO} />
        </div>
    );
}

function ChannelSection({ channels, sectionType, userEmployeeData, teamId, }: { channels?: Channel[], sectionType: ChannelType, userEmployeeData: Employee, teamId?: string }) {
    const router = useRouter();

    function channelClickHandler(id: string) {
        router.push(`/${userEmployeeData.organizationId}/chats/channel/${id}`);
    }

    const isOwner = userEmployeeData.role === Role.OWNER;
    const isManager = userEmployeeData.role === Role.MANAGER;
    const canDelete = isOwner || isManager;

    return (
        <div className="my-2">
            <div className="flex cursor-pointer justify-between w-full px-4 uppercase font-bold text-sm items-center dark:text-[hsl(287,60%,40%)]">
                <p>{`${sectionType} Channels`}</p>
                <Modal title={`Create ${sectionType === "TEXT" ? "Text" : "Video"} Channel`} trigger={
                    <span>
                        <ToolTip toolTipContent={"Create Channel"}>
                            <Plus className="h-5 w-5" />
                        </ToolTip>
                    </span>} form={<ChannelCreateModalContent userEmployeeData={userEmployeeData} channelType={sectionType} teamId={teamId} />} />
            </div>
            {channels && channels.length !== 0 && channels.map(channel => {
                if (channel.channelType === sectionType)
                    return (
                        <div key={channel.id} className="my-2 flex cursor-pointer justify-between w-full px-8 font-bold text-sm items-center dark:text-[hsl(287,60%,40%)] hover:dark:bg-[hsl(287,60%,20%)] py-2">
                            <button onClick={() => channelClickHandler(channel.id)} className="flex items-center space-x-2">
                                {ChannelIconType[sectionType]}
                                <p>{channel.name}</p>
                            </button>
                            {canDelete &&
                                ((!teamId && channel.name !== "general") ||
                                    (!!teamId)) &&
                                <Modal title="Delete Channel"
                                    trigger={
                                        <span>
                                            <ToolTip toolTipContent={"Delete Channel"} >
                                                <Trash2 className="h-5 w-5" />
                                            </ToolTip>
                                        </span>}
                                    form={<ChannelDeleteModalContent channel={channel} />} />
                            }
                        </div>
                    );
            })}
        </div>
    )
}