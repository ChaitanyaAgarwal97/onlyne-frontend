import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server";
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

    const data: { selectedEmployeesId: string[]; teamId: string } =
      await req.json();

    const members = await prisma.teamMember.findMany({
      where: {
        AND: [
          {
            teamId: data.teamId,
          },
          {
            employeeId: {
              in: data.selectedEmployeesId,
            },
          },
        ],
      },
    });

    if (members.length)
      return new NextResponse(
        JSON.stringify({
          message: "Invalid Input",
          issues: ["Employee(s) already exist in team."],
        }),
        { status: 400 },
      );

    // New Team Members added
    const teamMembers = await prisma.teamMember.createMany({
      data: data.selectedEmployeesId.map((employeeId) => ({
        employeeId: employeeId,
        teamId: data.teamId,
      })),
    });

    if (!teamMembers)
      return new NextResponse(
        JSON.stringify({
          message: "Something went wrong",
          issues: [],
        }),
        { status: 500 },
      );

    return new NextResponse(
      JSON.stringify({
        message: "success",
        issues: [],
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
      }),
      { status: 500 },
    );
  }
}
