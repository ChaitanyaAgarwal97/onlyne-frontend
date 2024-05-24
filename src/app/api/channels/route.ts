import { ChannelData } from "@/app/components/chats/channels/ChannelCreateModalContent";
import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { permanentRedirect, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId)
    return new NextResponse(JSON.stringify({ issues: ["Unauthorized"] }), {
      status: 400,
    });

  const data: ChannelData = await req.json();

  await prisma.channel.create({
    data: {
      name: data.name,
      channelType: data.channelType,
      createdById: data.createdById,
      organizationId: data.organizationId,
      teamId: data.teamId && data.teamId !== "" ? data.teamId : null,
    },
  });

  return new NextResponse(JSON.stringify({ message: "success" }), {
    status: 201,
  });
}
