import { create } from "zustand";
import type {
  CreateEventRequest,
  UpdateEventRequest,
  Event,
} from "../shared/api/types";
import { getApiErrorMessage } from "../lib/utils";
import { eventsApi } from "../shared/api/events-api";
import { meApi } from "../shared/api/me-api";

export type MyEventsFilter = "joined" | "created";

type EventsState = {
  events: Event[];
  myEvents: Event[];
  currentEvent: Event | null;
  myEventsFilter: MyEventsFilter | "created";
  eventsLoading: boolean;
  joinedLoading: boolean;
  mutationLoading: boolean;
  error: string | null;

  isLoading: boolean;

  setMyEventsFilter: (filter: MyEventsFilter) => void;
  loadEvents: () => Promise<void>;
  loadJoinedEvents: () => Promise<Event[]>;
  createEvent: (payload: CreateEventRequest) => Promise<Event>;
  updateEvent: (id: string, payload: UpdateEventRequest) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;

  fetchEvents: () => Promise<Event[]>;
  fetchMyEvents: () => Promise<Event[]>;
  fetchEventById: (id: string) => Promise<Event>;
  getParticipants: (id: string) => Promise<void>;
};

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  myEvents: [],
  currentEvent: null,
  myEventsFilter: "created",
  eventsLoading: false,
  joinedLoading: false,
  mutationLoading: false,

  isLoading: false,
  error: null,

  setMyEventsFilter: (filter: MyEventsFilter) => {
    set({ myEventsFilter: filter });
  },

  loadEvents: async () => {
    await get().fetchEvents();
  },

  loadJoinedEvents: async () => {
    return await get().fetchMyEvents();
  },

  updateEvent: async (id: string, payload: UpdateEventRequest) => {
    set({ mutationLoading: true, error: null });
    try {
      const updatedEvent = await eventsApi.update(id, payload);
      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? updatedEvent : event,
        ),
        myEvents: state.myEvents.map((joined) =>
          joined.id === id ? updatedEvent : joined,
        ),
        mutationLoading: false,
      }));
      return updatedEvent;
    } catch (error) {
      set({ error: getApiErrorMessage(error), mutationLoading: false });
      throw error;
    }
  },

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await eventsApi.getAll();
      set({ events, isLoading: false });
      return events;
    } catch (error) {
      set({ error: getApiErrorMessage(error), isLoading: false });
      throw error;
    }
  },
  fetchMyEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const myEvents = await meApi.joinedEvents();
      set({ myEvents, isLoading: false });

      return myEvents;
    } catch (error) {
      set({ error: getApiErrorMessage(error), isLoading: false });
      throw error;
    }
  },
  fetchEventById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const event = await eventsApi.getById(id);
      set({ currentEvent: event, isLoading: false });
      return event;
    } catch (error) {
      set({ error: getApiErrorMessage(error), isLoading: false });
      throw error;
    }
  },
  createEvent: async (payload: CreateEventRequest) => {
    set({ mutationLoading: true, error: null });
    try {
      const newEvent = await eventsApi.create(payload);
      set((state) => ({
        events: [...state.events, newEvent].sort(
          (a, b) =>
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
        ),
        mutationLoading: false,
      }));
      await get().joinEvent(newEvent.id);
      return newEvent;
    } catch (error) {
      set({ error: getApiErrorMessage(error), mutationLoading: false });
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    set({ mutationLoading: true, error: null });
    try {
      await eventsApi.delete(id);
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        myEvents: state.myEvents.filter((joined) => joined.id !== id),
        mutationLoading: false,
      }));
    } catch (error) {
      set({ error: getApiErrorMessage(error), mutationLoading: false });
      throw error;
    }
  },
  joinEvent: async (id: string) => {
    set({ mutationLoading: true, error: null });
    try {
      await eventsApi.join(id);
      const freshMyEvents = await get().fetchMyEvents();
      await get().fetchEventById(id);
      set({ myEvents: freshMyEvents, mutationLoading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), mutationLoading: false });
      throw error;
    }
  },
  leaveEvent: async (id: string) => {
    set({ mutationLoading: true, error: null });
    try {
      await eventsApi.leave(id);
      const freshMyEvents = await get().fetchMyEvents();
      await get().fetchEventById(id);
      set({ myEvents: freshMyEvents, mutationLoading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), mutationLoading: false });
      throw error;
    }
  },
  getParticipants: async (id: string) => {
    set({ mutationLoading: true, error: null });
    try {
      const participants = await eventsApi.getParticipants(id);
      console.log("Participants for event", id, ":", participants);
      set({ mutationLoading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), mutationLoading: false });
    }
  },
}));
