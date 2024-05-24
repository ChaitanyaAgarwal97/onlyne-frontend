import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types/NextApiResponseServerIo";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { Profile, Message } from "@prisma/client";
import { prisma } from "@/db";

import { MessageCircleOff } from "lucide-react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, organizationId, channelId } = req.query;
    const { content, fileUrl } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!organizationId) {
      return res.status(400).json({ error: "Organization ID is missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId as string,
        Employees: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        Employees: true,
      },
    });

    if (!organization) {
      return res.status(404).json({ error: "Server Not Found" });
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        organizationId: organizationId as string,
      },
    });

    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const employee = organization.Employees.find(
      (employee) => employee.profileId === profile.id,
    );

    if (!employee) {
      return res.status(404).json({ error: "Member not found" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        employeeId: employee.id,
      },
      include: {
        employee: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
