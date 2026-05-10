import { http } from "./http";
import type { Event } from "./types";

export const meApi = {
  async joinedEvents(): Promise<Event[]> {
    const { data } = await http.get<{ events: Event[] }>("/me/events/joined", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data) {
      throw new Error("Не вдалося отримати профіль користувача");
    }
    return data.events;
  },
};
