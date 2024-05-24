import { Applicant } from "@/app/components/applicants/ApplicantForm";
import { prisma } from "@/db";
import { ApplicantSchema } from "@/zodSchema/applicantSchema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Create operation on applicants
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
          issues: [],
        }),
        { status: 401 },
      );
    }

    const employee = await prisma.employee.findFirst({
      where: {
        profileId: userId,
        role: {
          in: ["HR", "OWNER"],
        },
      },
    });

    if (!employee)
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
          issues: [],
        }),
        { status: 401 },
      );

    const data: Applicant = await req.json();

    const parsed = ApplicantSchema.safeParse(data);

    if (!parsed.success)
      return new NextResponse(
        JSON.stringify({
          message: "Invalid Input",
          issues: parsed.error.issues.map((issue) => issue.message),
          fields: data,
        }),
        { status: 405 },
      );

    // New Applicant added
    const applicant = await prisma.applicant.create({
      data: {
        ...data,
        createdById: employee.id,
        organizationId: employee.organizationId,
        hiredById: data.status === "HIRED" ? employee?.id : null,
      },
    });

    if (!applicant)
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
