import type { DayErrors, SessionErrors } from "../schema/event.schema";

export interface Session {
    id: number;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
}

export interface DaySchedule {
    id: number;
    date: Date;
    location: string;
    startTime: Date;
    endTime: Date;
    sessions: Session[];
}

export interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    timetable: DaySchedule[];
}

export interface EventItem {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    creatorName: string;
}

export type EventStatus = "active" | "break" | "upcoming" | "ended";

export interface DraftSession {
    _key: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
}

export interface DraftDay {
    _key: string;
    date: string;
    location: string;
    sessions: DraftSession[];
}

export interface DayBlockProps {
    day: DraftDay;
    index: number;
    errors?: DayErrors;
    onUpdate: (d: DraftDay) => void;
    onRemove: () => void;
}

export interface SessionCardProps {
    session: DraftSession;
    errors?: SessionErrors;
    onUpdate: (s: DraftSession) => void;
    onRemove: () => void;
}

