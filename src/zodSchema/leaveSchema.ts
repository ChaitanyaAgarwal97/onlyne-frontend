import { z } from "zod";

export const LeaveSchema = z.object({
  reason: z.string().trim().min(1, {
    message: "Reason is required",
  }),
  from: z.union(
    [
      z.date(),
      z.string().trim().min(1, {
        message: "From date is required",
      }),
    ],
    {
      message: "From date is required",
      required_error: "From date is required",
    },
  ),
  to: z.union(
    [
      z.date(),
      z.string().trim().min(1, {
        message: "To date is required",
      }),
    ],
    {
      message: "To date is required",
      required_error: "To date is required",
    },
  ),
  rejoinedOn: z.union([z.date(), z.string()]).optional(),
  status: z.enum(["APPLIED", "ON_HOLD", "APPROVED", "REJECTED"]),
});
