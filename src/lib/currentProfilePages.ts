import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/db";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }
  const profile = await prisma.profile.findUnique({
    where: {
      id: userId,
    },
  });

  return profile;
};
