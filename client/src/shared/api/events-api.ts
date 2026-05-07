import { http } from "./http";
import type {
  CreateEventRequest,
  Event,
  JoinEventResponse,
  ParticipantsResponse,
  UpdateEventRequest,
} from "./types";

export const eventsApi = {
  async getAll(): Promise<Event[]> {
    const { data } = await http.get<Event[]>("/events");
    console.log("Fetched events:", data);
    return data;
  },

  async getById(id: string) {
    const { data } = await http.get<Event>(`/events/${id}`);
    if (!data) {
      throw new Error("Failed to fetch event");
    }
    console.log("Fetched event:", data);
    return data;
  },
  async create(payload: CreateEventRequest): Promise<Event> {
    const { data } = await http.post<Event>("/events", payload);
    if (!data) {
      throw new Error("Failed to create event");
    }
    console.log("Created event:", data);
    return data;
  },
  async update(id: string, payload: UpdateEventRequest): Promise<Event> {
    const { data } = await http.patch<Event>(`/events/${id}`, payload);

    if (!data) {
      throw new Error("Failed to update event");
    }
    console.log("Updated event:", data);
    return data;
  },
  async delete(id: string): Promise<void> {
    const { data } = await http.delete(`/events/${id}`);
    if (!data) {
      throw new Error("Failed to delete event");
    }
    console.log("Deleted event:", data);
    return data;
  },
  async join(id: string): Promise<JoinEventResponse> {
    const { data } = await http.post<JoinEventResponse>(`/events/${id}/join`);
    if (!data) {
      throw new Error("Failed to join event");
    }
    console.log("Joined event:", data);
    return data;
  },
  async leave(id: string): Promise<void> {
    const { data } = await http.delete(`/events/${id}/leave`);
    if (!data) {
      throw new Error("Failed to leave event");
    }
    console.log("Left event:", data);
    return data;
  },
  async getParticipants(id: string): Promise<ParticipantsResponse> {
    const { data } = await http.get<ParticipantsResponse>(
      `/events/${id}/participants`,
    );
    if (!data) {
      throw new Error("Failed to fetch participants");
    }
    console.log("Fetched participants:", data);
    return data;
  },
};
