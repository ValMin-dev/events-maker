import { http } from "./http";
import type { JoinedEventItem } from "./types";

export const meApi = {
  async joinedEvents(): Promise<JoinedEventItem[]> {
    const { data } = await http.get<JoinedEventItem[]>("/me/events/joined", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data) {
      throw new Error("Failed to fetch user profile");
    }
    console.log("Fetched user profile:", data);
    return data;
  },
};
