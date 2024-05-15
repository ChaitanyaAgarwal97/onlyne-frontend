import { z } from "zod";

export const EmployeeSchema = z.object({
  employeeId: z.string().trim().min(1),
  idCardImageUrl: z.string().trim().min(1),
  email: z.string().email(),
  designation: z.string().trim().min(1),
  status: z.enum([
    "ACTIVE",
    "PROBATION",
    "ONLEAVE",
    "EXEMPLOYEE",
    "PARTTIME",
    "INTERN",
  ]),
  office: z.string().trim().min(1),
  doj: z.union([z.date(), z.string()]),
});
