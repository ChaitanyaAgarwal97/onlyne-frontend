import { prisma } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();

  if (
    !user ||
    !user?.primaryEmailAddress ||
    !user?.fullName ||
    !user?.id ||
    !user?.username
  )
    return redirect("/sign-up");

  const userObj = {
    email: user.primaryEmailAddress.emailAddress,
    id: user.id,
    name: user.fullName,
    username: user.username,
  };

  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!profile) {
    await prisma.profile.create({
      data: {
        ...userObj,
      },
    });
  }

  return redirect("/createOrganization");
}
