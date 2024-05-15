import { z } from "zod";

export const OrganizationSchema = z.object({
  name: z.string().trim().min(1),
});
