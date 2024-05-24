import { z } from "zod";

export const ApplicantSchema = z.object({
  resumeUrl: z.string().trim().min(1, {
    message: "Resume is required",
  }),
  name: z.string().trim().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is not valid",
  }),
  designation: z.string().trim().min(1, {
    message: "Designation is required",
  }),
  status: z.enum(["RECEIVED", "SCHEDULED", "OFFEREXTENDED", "HIRED"]),
  office: z.string().trim().min(1, {
    message: "Office is required",
  }),
});
