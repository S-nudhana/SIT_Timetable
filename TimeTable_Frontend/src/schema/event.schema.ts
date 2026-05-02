import { z } from "zod";

export const sessionSchema = z.object({
    _key: z.string(),
    title: z.string().min(1, "กรุณากรอกชื่อกิจกรรม"),
    description: z.string().min(1, "กรุณากรอกรายละเอียดกิจกรรม"),
    startTime: z.string().min(1, "กรุณาเลือกเวลาเริ่มต้น"),
    endTime: z.string().min(1, "กรุณาเลือกเวลาสิ้นสุด"),
}).refine(
    (s) => s.startTime < s.endTime,
    { message: "เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด", path: ["endTime"] }
);

export const daySchema = z.object({
    _key: z.string(),
    date: z.string().min(1, "กรุณาเลือกวันที่"),
    location: z.string().min(1, "กรุณากรอกสถานที่"),
    sessions: z.array(sessionSchema).min(1, "แต่ละวันต้องมีอย่างน้อย 1 กิจกรรม"),
});

export const createEventSchema = z.object({
    title: z.string().min(1, "กรุณากรอกชื่อกิจกรรม"),
    description: z.string().min(1, "กรุณากรอกรายละเอียด"),
    days: z.array(daySchema).min(1, "ต้องมีอย่างน้อย 1 วัน"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type SessionErrors = Partial<Record<keyof z.infer<typeof sessionSchema>, string>>;
export type DayErrors = {
    date?: string;
    location?: string;
    sessions?: string;
    sessionErrors?: Record<string, SessionErrors>;
};
export type FormErrors = {
    title?: string;
    description?: string;
    days?: Record<string, DayErrors>;
};