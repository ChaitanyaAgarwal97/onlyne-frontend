import { EmployeeSchema } from "@/zodSchema/employeeSchema";
import { z } from "zod";

export type Employee = z.infer<typeof EmployeeSchema>;
