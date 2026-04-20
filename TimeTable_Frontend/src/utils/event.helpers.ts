import type { Event, Session, EventStatus } from "../types/event.type";

export const getActiveSession = (event: Event): Session | null => {
    const now = new Date();
    for (const day of event.timetable) {
        for (const session of day.sessions) {
            if (now >= session.startTime && now <= session.endTime) return session;
        }
    }
    return null;
};

export const getNextSession = (event: Event): Session | null => {
    const now = new Date();
    let closest: Session | null = null;
    for (const day of event.timetable) {
        for (const session of day.sessions) {
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