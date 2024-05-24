import { prisma } from "@/db";

export const getOrCreateConversation = async (
  employeeOneId: string,
  employeeTwoId: string,
) => {
  let conversation =
    (await findConversation(employeeOneId, employeeTwoId)) ||
    (await findConversation(employeeTwoId, employeeOneId));

  if (!conversation) {
    conversation = await createNewConversation(employeeOneId, employeeTwoId);
  }
  return conversation;
};

const findConversation = async (
  employeeOneId: string,
  employeeTwoId: string,
) => {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [
          { employeeOneId: employeeOneId },
          { employeeTwoId: employeeTwoId },
        ],
      },
      include: {
        employeeOne: {
          include: {
            profile: true,
          },
        },
        employeeTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};
const createNewConversation = async (
  employeeOneId: string,
  employeeTwoId: string,
) => {
  try {
    return await prisma.conversation.create({
      data: {
        employeeOneId,
        employeeTwoId,
      },
      include: {
        employeeOne: {
          include: {
            profile: true,
          },
        },
        employeeTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};
