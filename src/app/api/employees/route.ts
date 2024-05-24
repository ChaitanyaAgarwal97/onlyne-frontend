import { prisma } from "@/db";
import { Employee } from "@/types/Employee";
import { EmployeeSchema } from "@/zodSchema/employeeSchema";
import { auth } from "@clerk/nextjs/server";
import { EmployeeStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Create operation on employees
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

    const data: Employee = await req.json();

    const parsed = EmployeeSchema.safeParse(data);

    if (!parsed.success)
      return new NextResponse(
        JSON.stringify({
          message: "Invalid Input",
          issues: parsed.error.issues.map((issue) => issue.message),
          fields: data,
        }),
        { status: 405 },
      );

    const { email, ...employeeData } = data;

    const profileId = await prisma.profile.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!profileId)
      return new NextResponse(
        JSON.stringify({
          message: "Invalid Input",
          issues: ["This user does not exist"],
          fields: data,
        }),
        { status: 405 },
      );

    let employee = await prisma.employee.findFirst({
      where: {
        OR: [
          {
            employeeId: employeeData.employeeId,
          },
          {
            profileId: profileId.id,
          },
        ],
      },
    });
    console.log(employee);

    if (employee && employee.status !== EmployeeStatus.EXEMPLOYEE)
      return new NextResponse(
        JSON.stringify({
          message: "",
          issues: ["This user is already in an organization"],
          fields: data,
        }),
      );

    // New Employee added
    employee = await prisma.employee.create({
      data: {
        ...employeeData,
        profileId: profileId.id,
        doj: new Date(employeeData.doj),
      },
    });

    if (!employee)
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

// Update operation on employees
export async function PATCH(req: NextRequest) {
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

    const data: Employee = await req.json();

    const parsed = EmployeeSchema.safeParse(data);

    if (!parsed.success)
      return new NextResponse(
        JSON.stringify({
          message: "Invalid Input",
          issues: parsed.error.issues.map((issue) => issue.message),
          fields: data,
        }),
        { status: 405 },
      );

    const { email, ...employeeData } = data;

    const employee = await prisma.employee.update({
      where: {
        employeeId: employeeData.employeeId,
      },
      data: {
        ...employeeData,
        doj: new Date(employeeData.doj),
      },
    });

    if (!employee)
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
