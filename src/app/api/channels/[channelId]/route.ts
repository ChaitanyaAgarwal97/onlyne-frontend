import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } },
) {
  const channelId = params.channelId;

  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 400 });

  await prisma.channel.delete({
    where: {
      id: channelId,
    },
  });

  return new NextResponse(JSON.stringify({ message: "success" }), {
    status: 201,
  });
}
