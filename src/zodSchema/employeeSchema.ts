import { z } from "zod";

export const EmployeeSchema = z.object({
  employeeId: z.string().trim().min(1, {
    message: "EmployeeId is required",
  }),
  // idCardImageUrl: z.string().trim().min(1, {
  //   message: "Id Card Image is required",
  // }),
  email: z.string().email({
    message: "Email is not valid",
  }),
  designation: z.string().trim().min(1, {
    message: "Designation is required",
  }),
  role: z.enum(["MANAGER", "HR", "REGULAR"]),
  status: z.enum([
    "ACTIVE",
    "PROBATION",
    "ONLEAVE",
    "EXEMPLOYEE",
    "PARTTIME",
    "INTERN",
  ]),
  office: z.string().trim().min(1, {
    message: "Office is required",
  }),
  doj: z.union(
    [
      z.date(),
      z.string().trim().min(1, {
        message: "Date of Joining is required",
      }),
    ],
    {
      message: "Date of Joining is required",
      required_error: "Date of Joining is required",
    },
  ),
  organizationId: z.string().trim().uuid({
    message: "Organization ID is required",
  }),
});
