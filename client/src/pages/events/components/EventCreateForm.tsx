import { useEventsStore } from "../../../stores/event-store";
import { EventForm } from "./EventForm";
import { useNavigate } from "react-router-dom";

type Props = {
  className?: string;
};

export function EventCreateForm({ className }: Props) {
  const navigate = useNavigate();
  const { createEvent, mutationLoading, error } = useEventsStore();

  return (
    <EventForm
      className={className}
      title="Створити подію"
      subtitle="Заповніть дані, щоб створити нову подію."
      backTo="/events"
      backLabel="Назад до подій"
      submitLabel="Створити подію"
      submittingLabel="Створення..."
      cancelTo="/events"
      error={error}
      onSubmit={async (values) => {
        try {
          const createdEvent = await createEvent(values);
          navigate(`/events/${createdEvent.id}`, { replace: true });
        } catch (e) {}
      }}
      isLoading={mutationLoading}
    />
  );
}
