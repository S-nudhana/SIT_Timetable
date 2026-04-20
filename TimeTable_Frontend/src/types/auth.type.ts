import { z } from "zod";
import { loginSchema } from "../schema/auth.schema";

export type LoginForm = z.infer<typeof loginSchema>;
export type LoginErrors = Partial<Record<keyof LoginForm, string>>;