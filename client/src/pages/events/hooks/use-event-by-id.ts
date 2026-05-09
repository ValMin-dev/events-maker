import { useEffect, useState } from "react";
import { useEventsStore } from "../../../stores/event-store";
import { eventsApi } from "../../../shared/api/events-api";
import { isAxiosError } from "../../../shared/api/http";
import { getApiErrorMessage } from "../../../lib/utils";
import type { Event } from "../../../shared/api/types";

type UseEventByIdOptions = {
  prefetchJoinedEvents?: boolean;
};

export function useEventById(
  id: string | undefined,
  options?: UseEventByIdOptions,
) {
  const prefetchJoinedEvents = options?.prefetchJoinedEvents ?? false;
  const { loadJoinedEvents } = useEventsStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      setEvent(null);
      setError(null);
      return () => {
        cancelled = true;
      };
    }
    const loadEvent = async () => {
      setIsLoading(true);
      setNotFound(false);
      setError(null);
      try {
        const [fetchedEvent] = await Promise.all([
          eventsApi.getById(id),
          prefetchJoinedEvents
            ? loadJoinedEvents().catch(() => undefined)
            : Promise.resolve(undefined),
        ]);
        if (!cancelled) {
          setEvent(fetchedEvent);
        }
      } catch (error) {
        if (cancelled) return;

        if (isAxiosError(error) && error.response?.status === 404) {
          setNotFound(true);
          return;
        }
        setError(getApiErrorMessage(error));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    loadEvent();
    return () => {
      cancelled = true;
    };
  }, [id, prefetchJoinedEvents, loadJoinedEvents]);

  return {
    event,
    isLoading,
    notFound,
    error,
  };
}
