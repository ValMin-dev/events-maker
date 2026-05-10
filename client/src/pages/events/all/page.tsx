import { useEffect } from "react";
import { useEventsStore } from "../../../stores/event-store";
import { PageShell } from "../../../components/page-shell";
import { ErrorRetryBlock } from "../../../components/error-retry-block";
import { EventListCard } from "../components/EventListCard";

export function EventsAllPage() {
  const { events, loadEvents, isLoading, error } = useEventsStore();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const showInitialLoading = isLoading && events.length === 0;
  if (showInitialLoading) {
    return <div>Завантаження...</div>;
  }
  if (events.length === 0 && !isLoading && !error && !events) {
    return <div>Події не знайдено.</div>;
  }

  if (error) {
    return <ErrorRetryBlock className="mb-4" error={error} />;
  }

  return (
    <PageShell title="Усі події">
      {showInitialLoading ? <div>Завантаження...</div> : null}
      {error ? <ErrorRetryBlock className="mb-4" error={error} /> : null}

      <ul className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.id}>
            <EventListCard event={event} />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
