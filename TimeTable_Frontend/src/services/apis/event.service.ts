import axiosInstance from "../axios/axiosInstance";
import type { DraftDay } from "../../types/event.type";
import { toApiPayload } from "../../utils/event.helpers";

export const createEventApi = async (
    title: string,
    description: string,
    days: DraftDay[]
) => {
    const payload = toApiPayload(title, description, days);
    const res = await axiosInstance.post("/event/admin", payload);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error creating event");
};

export const getAdminEventListApi = async () => {
    const res = await axiosInstance.get("/event/admin");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error fetching admin event list");
}

export const deleteEventApi = async (id: number) => {
    const res = await axiosInstance.delete(`/event/${id}`);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error deleting event");
}

export const getEventListApi = async () => {
    const res = await axiosInstance.get(`/event`);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error fetching event list");
}

export const getEventDetailApi = async (id: number) => {
    const res = await axiosInstance.get(`/event/${id}`);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error fetching event detail");
}

export const updateEventApi = async (
    id: number,
    title: string,
    description: string,
    days: DraftDay[]
) => {
    const payload = toApiPayload(title, description, days);
    const res = await axiosInstance.put(`/event/${id}`, payload);
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error updating event");
}