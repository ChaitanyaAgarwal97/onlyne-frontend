import { Leave } from "@/app/components/leaves/LeaveForm";
import { prisma } from "@/db";
import { LeaveSchema } from "@/zodSchema/leaveSchema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Update operation on applicants
export async function PATCH(
    req: NextRequest,
    { params }: { params: { leaveId: string } },
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
                    in: ["MANAGER", "OWNER"]
                }
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

        const data: Leave = await req.json();

        const parsed = LeaveSchema.safeParse(data);

        if (!parsed.success)
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid Input",
                    issues: parsed.error.issues.map((issue) => issue.message),
                    fields: data,
                }),
                { status: 405 },
            );

        // Leave updated
        const leave = await prisma.leave.update({
            where: {
                id: params.leaveId,
            },
            data: {
                status: data.status,
                rejoinedOn: data.rejoinedOn ? new Date(data.rejoinedOn) : null,
                handledById: employee.id,
            },
        });

        if (!leave)
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
