import { Applicant } from "@/app/components/applicants/ApplicantForm";
import { prisma } from "@/db";
import { ApplicantSchema } from "@/zodSchema/applicantSchema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Update operation on applicants
export async function PATCH(
  req: NextRequest,
  { params }: { params: { applicantId: string } },
) {
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

    // Applicant updated
    const applicant = await prisma.applicant.update({
      where: {
        id: params.applicantId,
      },
      data: {
        ...data,
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
        status: 200,
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
