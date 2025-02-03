import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .min(1, "Username is required.")
    .min(4, "Username must be at least 4 characters.")
    .max(30, "Username must be at most 30 characters."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export default schema;
