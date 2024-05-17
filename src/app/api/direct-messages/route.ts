import { NextResponse } from "next/server";
import { DirectMessage} from "@prisma/client"
import { currentProfile } from '@/lib/current-profile';
import { db } from "@/lib/db";
import { error } from 'console';
import { skip } from "node:test";


export async funtction GEt(
    req: Request
) {
    try {
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)

        const cursor = searchParams.get("cursor")
        const convesationId = searchParams.get("channelId")

        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!convesationId) {
            return new NextResponse("Channel Id missing", {status: 400})
        }

        let messages: DirectMessage[]=[]

        if(cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    convesationId,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId,
                },
                include: {
                    member: {
                        include: {
                            profie: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }

        let nextCursor = null

        if(messages.length===MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH -1].id
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })

    } catch (error) {
        console.log("[DIRECT_MESSAGES_GET], error")
        return new NextResponse("Internal Error", {status: 500})
    }
}