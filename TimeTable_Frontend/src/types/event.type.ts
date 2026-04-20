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

export type EventStatus = "active" | "break" | "upcoming" | "ended";