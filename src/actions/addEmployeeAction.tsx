"use server";

import { prisma } from "@/db";
import { EmployeeSchema } from "@/zodSchema/employeeSchema";

export type FormState = {
  issues: string[];
  fields?: Record<string, string | Date>;
  message?: string;
};

export async function addEmployeeAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  console.log(data.get("idCardImageUrl"))
  const formData = Object.fromEntries(data);
  const parsed = EmployeeSchema.safeParse(formData);


  // Check to see if inputs are correct
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }

    return {
      issues: parsed.error.issues.map((issue) => issue.message),
      fields,
    };
  }

  const { email, ...newParsedData } = parsed.data;

  const profileId = await prisma.profile.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  // Check to see if the employee has created a profile
  if (!profileId) {
    return {
      issues: ["This user does not exists"],
      fields: parsed.data,
    };
  }

  const employee = await prisma.employee.create({
    data: {
      ...newParsedData,
      profileId: profileId.id,
    },
  });

  // Check to see if employee is added successfully by checking if a id is generated or not
  if (!employee.id) {
    return {
      issues: ["Something went wrong"],
      fields: parsed.data,
    };
  }


  return {
    issues: [],
    message: "success"
  };
}
