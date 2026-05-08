import { EventCreateForm } from "../components/EventCreateForm";

export function EventsNewPage() {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-4">
      <EventCreateForm />
    </div>
  );
}
