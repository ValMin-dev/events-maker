import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import type { Event } from "../../../shared/api/types";
import { formatStartDate } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
type Props = {
  event: Event;
};

export function EventListCard({ event }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm">
          {formatStartDate(event.startedAt)} - {event.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {event.description ? event.description : "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col mt-auto  pt-auto justify-between pt-4 gap-1">
        <p className="text-xs text-muted-foreground">
          До {event.capacity} участников
        </p>
        <p className="text-sm text-muted-foreground"></p>
        <Button size="sm" className="font-bold" variant="outline" asChild>
          <Link to={`/events/${event.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
