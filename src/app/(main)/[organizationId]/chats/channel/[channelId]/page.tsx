import MediaRoom from "@/app/components/MediaRoom";
import { ChatHeader } from "@/app/components/chats/ChatHeader";
import { ChatInput } from "@/app/components/chats/ChatInput";
import { ChatMessages } from "@/app/components/chats/ChatMessages";
import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server"
import { ChannelType, EmployeeStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function ChannelPage({ params }: { params: { organizationId: string, channelId: string } }) {
    const { userId } = auth();

    if (!userId) return redirect("/sign-up");

    const channel = await prisma.channel.findUnique({
        where: {
            id: params.channelId,
            organizationId: params.organizationId,
        }
    });

    const employee = await prisma.employee.findFirst({
        where: {
            organizationId: params.organizationId,
            profileId: userId,
        }
    })

    if (!channel) return redirect("/createOrganization");

    if (!employee || employee.status === EmployeeStatus.EXEMPLOYEE) return redirect("/createOrganization");

    return (
        <div className="bg-[hsl(287,60%,90%)] dark:bg-[hsl(287,60%,11%)] flex-1 flex flex-col h-full">
            <ChatHeader organizationId={params.organizationId} type="channel" name={channel.name} />
            {channel.channelType === ChannelType.TEXT &&
                <>

                    <ChatMessages employee={employee} name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            organizationId: channel.organizationId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{
                        channelId: channel.id,
                        organizationId: channel.organizationId
                    }} />
                </>
            }
            {channel.channelType === ChannelType.VIDEO &&
                <div className="h-[90%]">
                    <MediaRoom chatId={channel.id} video={true} audio={true} />
                </div>
            }
        </div>

    )
}