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
  onClickDelete: () => void;
};

export function EventDetailsCard({
  event,
  isOwner,
  isParticipant,
  mutationLoading,
  eventsError,
  onClickJoin,
  onClickDelete,
  onClickLeave,
}: Props) {
  const eventToRender = event;
  const isParticipantText = isParticipant
    ? "Покинути подію"
    : "Приєднатися до події";

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
            <p className="text-muted-foreground ">Коли</p>
            <p> {formatStartDate(eventToRender.startedAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground ">Опис</p>
            <p> {eventToRender.description}</p>
          </div>
          <div>
            <p className="text-muted-foreground ">Де</p>
            <p> {eventToRender.address}</p>
          </div>
          <div>
            <p className="text-muted-foreground ">Місткість</p>
            <p>До {eventToRender.capacity}</p>
          </div>
          <div>
            <p className="text-muted-foreground ">Залишилось місць</p>
            <p>{participantsLeft}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {isOwner ? (
            <>
              <p className="mr-auto text-sm text-muted-foreground">
                Ви організатор
              </p>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={onClickDelete}
                disabled={mutationLoading}
              >
                <Link to={`/events`}>Видалити подію</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                asChild
              >
                <Link to={`/events/${eventToRender.id}/edit`}>
                  Редагувати подію
                </Link>
              </Button>
            </>
          ) : participantsLeft === 0 ? (
            <>
              <p className="mr-auto text-sm text-muted-foreground">
                Місць немає
              </p>

              {isParticipant ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={onClickLeave}
                  disabled={mutationLoading}
                >
                  {isParticipantText}
                </Button>
              ) : null}
            </>
          ) : isParticipant ? (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={onClickLeave}
              disabled={mutationLoading}
            >
              {isParticipantText}
            </Button>
          ) : (
            <Button
              size="sm"
              className="cursor-pointer"
              onClick={onClickJoin}
              disabled={mutationLoading}
            >
              {isParticipantText}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
