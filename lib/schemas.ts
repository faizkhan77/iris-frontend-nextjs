import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const LoginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address." })
    .min(1, { message: "Email is required." }),
  password: z
    .string().min(1,"Password Is required"),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
