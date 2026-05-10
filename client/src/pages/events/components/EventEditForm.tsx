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
        <span>Event not found.</span>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div
        className={`flex w-full h-full flex-col items-center justify-center gap-4 ${className}`}
      >
        <span>Loading event details...</span>
      </div>
    );
  }
  if (eventError) {
    return (
      <div
        className={`flex w-full h-full flex-col items-center justify-center gap-4 ${className}`}
      >
        <span className="text-destructive">
          Error loading event: {eventError}
        </span>
      </div>
    );
  }
  if (!user || user.id !== event.ownerId) {
    return (
      <div
        className={`flex w-full h-full flex-col items-center justify-center gap-4 ${className}`}
      >
        <span>You do not have permission to edit this event.</span>
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
        title="Edit Event"
        subtitle=" Make changes to your event details below."
        backTo={`/events/${event.id}`}
        backLabel=" Back to details"
        cancelTo={`/events/${event.id}`}
        submittingLabel="Saving"
        inputValues={{
          title: event.title,
          description: event.description,
          address: event.address,
          capacity: event.capacity,
          startedAt: startedAtForInput,
        }}
        submitLabel="Save Changes"
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
