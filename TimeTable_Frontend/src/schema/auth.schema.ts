import { z } from "zod";

export const loginSchema = z.object({
    username: z.email().min(1, "กรุณากรอกบัญชีผู้ใช้"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});