import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().optional().default(""),
  timestamp: z.coerce
    .date({ message: "Invalid date format" })
    .refine((value) => value.getTime() > new Date().getTime(), {
      message: "Date must be in the future.",
    }),
  yearly: z.coerce.boolean().default(false),
});

export default schema;
