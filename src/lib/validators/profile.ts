import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 chars"),
  email: z.string().email("Invalid email"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
