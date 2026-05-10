import { Link, Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth-store";
import { useEventsStore } from "../../../stores/event-store";
import { useEventById } from "../hooks/use-event-by-id";
import { PageShell } from "../../../components/page-shell";
import { Button } from "../../../components/ui/button";
import { EventDetailsCard } from "../components/EventDetailsCard";
import { eventsApi } from "../../../shared/api/events-api";
export function EventDetailsPage() {
  const { user, isAuthLoading, isAuthenticated } = useAuthStore();
  const { id } = useParams<{ id: string }>();
  const {
    myEvents,
    joinEvent,
    leaveEvent,

    mutationLoading,
    currentEvent,
    fetchEventById,
  } = useEventsStore();

  const {
    event,
    isLoading,
    notFound,
    error: eventError,
  } = useEventById(id, {
    prefetchJoinedEvents: true,
  });

  const visibleEvent = currentEvent?.id === event?.id ? currentEvent : event;

  if (!id || notFound) {
    return <Navigate to="/events" replace />;
  }
  if (isAuthLoading) {
    return (
      <PageShell title="Завантаження...">
        <span>Завантаження профілю користувача...</span>
      </PageShell>
    );
  }
  if (isLoading) {
    return (
      <PageShell title="Завантаження...">
        <span>Завантаження деталей події...</span>
      </PageShell>
    );
  }
  if (eventError) {
    return (
      <PageShell title="Помилка">
        <span>Помилка завантаження події: {eventError}</span>
      </PageShell>
    );
  }
  if (!isAuthenticated || !user) {
    return (
      <PageShell title="Помилка">
        <span>Помилка автентифікації: користувач не увійшов у систему</span>
      </PageShell>
    );
  }

  const onClickDelete = async () => {
    try {
      if (!visibleEvent) return;
      if (confirm("Ви впевнені, що хочете видалити цю подію?")) {
        await eventsApi.delete(visibleEvent.id);
      }
    } catch (error) {
      alert("Не вдалося видалити подію. Будь ласка, спробуйте ще раз.");
    }
  };
  const handleJoinClick = async () => {
    try {
      if (!visibleEvent) return;
      await joinEvent(visibleEvent.id);
      await fetchEventById(visibleEvent.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeaveClick = async () => {
    try {
      if (!visibleEvent) return;
      await leaveEvent(visibleEvent.id);
      await fetchEventById(visibleEvent.id);
    } catch (error) {
      console.error(error);
    }
  };

  const isOwner = user?.id === visibleEvent?.ownerId;
  const isParticipant = myEvents.some(
    (joined) => joined.id === visibleEvent?.id,
  );

  return (
    <PageShell title={visibleEvent?.title || "Деталі події"}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit cursor-pointer"
          asChild
        >
          <Link to="/events">Повернутися до подій</Link>
        </Button>

        <EventDetailsCard
          event={visibleEvent!}
          isOwner={isOwner}
          isParticipant={isParticipant}
          mutationLoading={mutationLoading}
          eventsError={eventError}
          onClickJoin={handleJoinClick}
          onClickLeave={handleLeaveClick}
          onClickDelete={onClickDelete}
        />
      </div>
    </PageShell>
  );
}
