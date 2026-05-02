import type { EventStatus, Event, DaySchedule, Session, DraftDay, DraftSession } from "../types/event.type";

export const getActiveSession = (event: Event): Session | null => {
    const now = new Date();
    if (!event.timetable) return null;
    for (const day of event.timetable) {
        for (const session of day.sessions ?? []) {
            if (now >= session.startTime && now <= session.endTime) return session;
        }
    }
    return null;
};

export const getNextSession = (event: Event): Session | null => {
    const now = new Date();
    if (!event.timetable) return null;
    let closest: Session | null = null;
    for (const day of event.timetable) {
        for (const session of day.sessions ?? []) {
            if (session.startTime > now) {
                if (!closest || session.startTime < closest.startTime) closest = session;
            }
        }
    }
    return closest;
};


export const getEventStatus = (event: Event): EventStatus => {
    const now = new Date();
    if (now < event.startDate) return "upcoming";
    if (now > event.endDate) return "ended";
    return getActiveSession(event) ? "active" : "break";
};

export const getStatusLabel = (event: Event): string | null => {
    const status = getEventStatus(event);
    if (status === "active") {
        const session = getActiveSession(event);
        return session ? `กิจกรรมที่ดำเนินอยู่: ${session.title}` : "กิจกรรมที่ดำเนินอยู่"
    }
    if (status === "break") {
        const next = getNextSession(event);
        return next ? `ช่วงพัก — กิจกรรมถัดไป: ${next.title}` : "ช่วงพัก";
    }
    if (status === "upcoming") {
        const next = getNextSession(event);
        return next ? `กิจกรรมที่กำลังจะมาถึง: ${next.title}` : "กิจกรรมที่กำลังจะมาถึง";
    }
    return null;
};

let _id = 1;
export const nextId = () => _id++;
export const makeKey = () => Math.random().toString(36).slice(2);

export const makeSession = (): DraftSession => ({
    _key: makeKey(),
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "12:00",
});

export const makeDay = (): DraftDay => ({
    _key: makeKey(),
    date: "",
    location: "",
    sessions: [makeSession()],
});

export const toDate = (dateStr: string, timeStr: string): Date =>
    new Date(`${dateStr}T${timeStr}:00`);

export const buildEvent = (
    title: string,
    description: string,
    days: DraftDay[]
): Omit<Event, "id"> => {
    const timetable: DaySchedule[] = days.map((day) => {
        const sessionDates = day.sessions.map((s) => ({
            start: toDate(day.date, s.startTime),
            end: toDate(day.date, s.endTime),
        }));
        const dayStart = new Date(Math.min(...sessionDates.map((s) => s.start.getTime())));
        const dayEnd = new Date(Math.max(...sessionDates.map((s) => s.end.getTime())));

        return {
            id: nextId(),
            date: new Date(day.date),
            location: day.location,
            startTime: dayStart,
            endTime: dayEnd,
            sessions: day.sessions.map((s): Session => ({
                id: nextId(),
                title: s.title,
                description: s.description,
                startTime: toDate(day.date, s.startTime),
                endTime: toDate(day.date, s.endTime),
            })),
        };
    });

    const allDates = timetable.map((d) => d.date);
    return {
        title,
        description,
        location: timetable[0]?.location ?? "",
        startDate: new Date(Math.min(...allDates.map((d) => d.getTime()))),
        endDate: new Date(Math.max(...allDates.map((d) => d.getTime()))),
        timetable,
    };
};

export const toApiPayload = (
    title: string,
    description: string,
    days: DraftDay[]
) => {
    const timelines = days.flatMap((day) =>
        day.sessions.map((s) => ({
            Title: s.title,
            Description: s.description,
            StartTime: toDate(day.date, s.startTime).toISOString(),
            EndTime: toDate(day.date, s.endTime).toISOString(),
        }))
    );

    return {
        Title: title,
        Description: description,
        Location: days[0]?.location ?? "",
        Timelines: timelines,
    };
};