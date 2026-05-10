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
    const { data } = await http.get<{ message: string; events: Event[] }>(
      "/events",
    );
    return data.events;
  },

  async getById(id: string) {
    const { data } = await http.get<{ message: string; event: Event }>(
      `/events/${id}`,
    );
    if (!data) {
      throw new Error("Не вдалося отримати подію");
    }
    return data.event;
  },
  async create(payload: CreateEventRequest): Promise<Event> {
    const { data } = await http.post<{ message: string; event: Event }>(
      "/events",
      payload,
    );
    if (!data) {
      throw new Error("Не вдалося створити подію");
    }
    return data.event;
  },
  async update(id: string, payload: UpdateEventRequest): Promise<Event> {
    const { data } = await http.patch<Event>(`/events/${id}`, payload);

    if (!data) {
      throw new Error("Не вдалося оновити подію");
    }
    return data;
  },
  async delete(id: string): Promise<void> {
    const { data } = await http.delete(`/events/${id}`);
    if (!data) {
      throw new Error("Не вдалося видалити подію");
    }
    return data;
  },
  async join(id: string): Promise<JoinEventResponse> {
    const { data } = await http.post<JoinEventResponse>(`/events/${id}/join`);
    if (!data) {
      throw new Error("Не вдалося приєднатися до події");
    }
    return data;
  },
  async leave(id: string): Promise<void> {
    const { data } = await http.delete(`/events/${id}/leave`);
    if (!data) {
      throw new Error("Не вдалося покинути подію");
    }
    return data;
  },
  async getParticipants(id: string): Promise<ParticipantsResponse> {
    const { data } = await http.get<ParticipantsResponse>(
      `/events/${id}/participants`,
    );
    if (!data) {
      throw new Error("Не вдалося отримати учасників");
    }
    return data;
  },
};
