import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types/NextApiResponseServerIo";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { prisma } from "@/db";
import { MessageCircleOff } from "lucide-react";
import { Role } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, organizationId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!organizationId) {
      return res.status(400).json({ error: "Organization ID is missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is missing" });
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
      return res.status(404).json({ error: "Organization Not Found" });
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        organizationId: organizationId as string,
      },
    });

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const employee = organization.Employees.find(
      (employee) => employee.profileId === profile.id,
    );

    if (!employee) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        employee: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageSender = message.employeeId === employee.id;
    const isOwner = employee.role === Role.OWNER;
    const isManager = employee.role === Role.MANAGER;
    const canModify = isMessageSender || isOwner || isManager;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthohrized" });
    }

    if (req.method === "DELETE") {
      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          employee: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
