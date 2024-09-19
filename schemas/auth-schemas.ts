import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string({
    message: "user name is required",
  }),
  password: z.string({
    message: "password is required",
  }),
});
