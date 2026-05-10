import { useEffect } from "react";
import { useAuthStore } from "../../../stores/auth-store";
import { useEventsStore } from "../../../stores/event-store";
import { PageShell } from "../../../components/page-shell";
import { MyEventsStatTitle } from "../components/MyEventsStatTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { EventsTable } from "../components/EventsTable";

export function MyEventsPage() {
  const { user } = useAuthStore();
  const {
    events,
    myEvents,
    myEventsFilter,
    loadEvents,
    loadJoinedEvents,
    isLoading,
    error,
  } = useEventsStore();

  useEffect(() => {
    Promise.all([loadEvents(), loadJoinedEvents()]);
  }, [loadEvents, loadJoinedEvents]);

  const createdList = () => {
    if (!user) {
      return [];
    }
    return events
      .filter((event) => event.ownerId === user.id)
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      );
  };
  const createdCount = createdList().length;
  const joinedCount = myEvents.length;
  return (
    <PageShell title="Мої події">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          <MyEventsStatTitle label="Створив" value={createdCount} />
          <MyEventsStatTitle label="Приєднався" value={joinedCount} />
        </div>
        {error ? (
          <div className="text-destructive">
            Помилка завантаження подій: {error}
          </div>
        ) : null}
        <Tabs
          defaultValue={myEventsFilter}
          onValueChange={(value) =>
            String(value) === "created" || String(value) === "joined"
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger className="cursor-pointer" value="created">
              Створені
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="joined">
              Приєднанався
            </TabsTrigger>
          </TabsList>
          <TabsContent value="created" className="pt-4">
            {isLoading && createdList().length === 0 ? (
              <div>Завантаження...</div>
            ) : createdList().length === 0 ? (
              <div>Створених подій не знайдено.</div>
            ) : (
              <EventsTable events={createdList()} />
            )}
          </TabsContent>

          <TabsContent value="joined" className="pt-4">
            {isLoading && myEvents.length === 0 ? (
              <div>Завантаження...</div>
            ) : myEvents.length === 0 ? (
              <div>Приєднаних подій не знайдено.</div>
            ) : (
              <EventsTable events={myEvents} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
