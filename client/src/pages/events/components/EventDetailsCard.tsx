import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { formatStartDate } from "../../../lib/utils";
import type { Event } from "../../../shared/api/types";
type Props = {
  event: Event;
  isOwner: boolean;
  isParticipant: boolean;
  mutationLoading: boolean;
  eventsError: string | null;

  onClickJoin: () => void;
  onClickLeave: () => void;
};

export function EventDetailsCard({
  event,
  isOwner,
  isParticipant,
  mutationLoading,
  eventsError,
  onClickJoin,
  onClickLeave,
}: Props) {
  const eventToRender = event;
  const isParticipantText = isParticipant
    ? "Покинуть событие"
    : "Присоединиться к событию";

  const participantsCount = eventToRender.participants?.length ?? 0;
  const participantsLeft = eventToRender.capacity - participantsCount;

  return (
    <>
      {eventsError && (
        <div className="mb-4 text-destructive">{eventsError}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-snug">
            {eventToRender.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground ">Когда</p>
            <p> {formatStartDate(eventToRender.startedAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground ">Описание</p>
            <p> {eventToRender.description}</p>
          </div>
          <div>
            <p className="text-muted-foreground ">Где</p>
            <p> {eventToRender.address}</p>
          </div>
          <div>
            <p className="text-muted-foreground ">Вместимость</p>
            <p>До {eventToRender.capacity}</p>
          </div>
          <div>
            <p className="text-muted-foreground ">Осталось мест</p>
            <p>{participantsLeft}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {isOwner ? (
            <>
              <p className="mr-auto text-sm text-muted-foreground">
                Вы организатор
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/events/${eventToRender.id}/edit`}>
                  Редактировать
                </Link>
              </Button>
            </>
          ) : isParticipant ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onClickLeave}
              disabled={mutationLoading}
            >
              {isParticipantText}
            </Button>
          ) : (
            <Button size="sm" onClick={onClickJoin} disabled={mutationLoading}>
              {isParticipantText}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
