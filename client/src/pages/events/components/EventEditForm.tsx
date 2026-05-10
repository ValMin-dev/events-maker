import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth-store";
import { useEventsStore } from "../../../stores/event-store";
import { useEventById } from "../hooks/use-event-by-id";
import { isValid } from "date-fns/isValid";
import { format } from "date-fns";
import { DATETIME_LOCAL_INPUT_FORMAT } from "../../../lib/utils";
import { EventForm } from "./EventForm";

type Props = {
  className?: string;
};

export function EventEditForm({ className }: Props) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { updateEvent } = useEventsStore();
  const { mutationLoading, error: mutationError } = useEventsStore();

  const { event, isLoading, error: eventError } = useEventById(id);

  if (!id || !event) {
    return (
      <div
        className={`flex w-full h-full flex-col items-center justify-center gap-4 ${className}`}
      >
        <span>Подію не знайдено.</span>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div
        className={`flex w-full h-full flex-col items-center justify-center gap-4 ${className}`}
      >
        <span>Завантаження деталей події...</span>
      </div>
    );
  }
  if (eventError) {
    return (
      <div
        className={`flex w-full h-full flex-col items-center justify-center gap-4 ${className}`}
      >
        <span className="text-destructive">
          Помилка завантаження події: {eventError}
        </span>
      </div>
    );
  }
  if (!user || user.id !== event.ownerId) {
    return (
      <div
        className={`flex w-full h-full flex-col items-center justify-center gap-4 ${className}`}
      >
        <span>У вас немає дозволу редагувати цю подію.</span>
      </div>
    );
  }

  const startedAtParsed = new Date(event.startedAt);
  const startedAtForInput = isValid(startedAtParsed)
    ? format(startedAtParsed, DATETIME_LOCAL_INPUT_FORMAT)
    : "";

  return (
    <div
      className={`flex w-full h-full flex-col items-center justify-center gap-4 ${className}`}
    >
      <EventForm
        key={event.id}
        title="Редагувати подію"
        subtitle="Внесіть зміни до деталей події нижче."
        backTo={`/events/${event.id}`}
        backLabel="Назад до деталей"
        cancelTo={`/events/${event.id}`}
        submittingLabel="Збереження"
        inputValues={{
          title: event.title,
          description: event.description,
          address: event.address,
          capacity: event.capacity,
          startedAt: startedAtForInput,
        }}
        submitLabel="Зберегти зміни"
        onSubmit={async (values) => {
          await updateEvent(id, values);
          navigate(`/events/${id}`);
        }}
        isLoading={mutationLoading}
        error={mutationError}
      />
    </div>
  );
}
