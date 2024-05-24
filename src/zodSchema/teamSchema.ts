import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required",
  }),
  createdById: z.string().trim().min(1, {
    message: "Created By is required",
  }),
  organizationId: z.string().uuid(),
});
