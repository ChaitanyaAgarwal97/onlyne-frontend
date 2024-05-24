import { Team } from "@/app/components/chats/createTeamForm/CreateTeamForm";
import { prisma } from "@/db";
import { TeamSchema } from "@/zodSchema/teamSchema";
import { auth } from "@clerk/nextjs/server";
import { TeamMemberType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Create operation on teams
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId)
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
          issues: [],
        }),
        { status: 401 },
      );

    const data: Team = await req.json();

    const parsed = TeamSchema.safeParse(data);

    if (!parsed.success)
      return new NextResponse(
        JSON.stringify({
          message: "Invalid Input",
          issues: parsed.error.issues.map((issue) => issue.message),
          fields: data,
        }),
        { status: 405 },
      );

    const organization = await prisma.organization.findUnique({
      where: {
        id: data.organizationId,
      },
    });

    if (!organization)
      return new NextResponse(
        JSON.stringify({
          message: "Invalid Input",
          issues: ["This organization does not exist"],
          fields: data,
        }),
        { status: 405 },
      );

    const employee = await prisma.employee.findFirst({
      where: {
        profileId: data.createdById,
      },
    });

    if (!employee)
      return new NextResponse(
        JSON.stringify({
          message: "",
          issues: ["The employee does not exist in organization"],
          fields: data,
        }),
      );

    // New Team added
    const team = await prisma.team.create({
      data: {
        name: data.name,
        createdById: employee.id,
        organizationId: data.organizationId,
      },
    });

    // Manager added to team member list
    const teamMember = await prisma.teamMember.create({
      data: {
        memberType: TeamMemberType.MANAGER,
        employeeId: employee.id,
        teamId: team.id,
      },
    });

    // General channel added to team channels list
    const channel = await prisma.channel.create({
      data: {
        name: "general",
        createdById: employee.id,
        organizationId: data.organizationId,
        teamId: team.id,
      },
    });

    if (!team && !teamMember && !channel)
      return new NextResponse(
        JSON.stringify({
          message: "Something went wrong",
          issues: [],
          fields: data,
        }),
        { status: 500 },
      );

    return new NextResponse(
      JSON.stringify({
        message: "success",
        issues: [],
        teamId: team.id,
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log(error);

    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong",
        issues: [],
        fields: {},
      }),
      { status: 500 },
    );
  }
}
