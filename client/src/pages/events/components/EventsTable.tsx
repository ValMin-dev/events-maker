import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { Event } from "../../../shared/api/types";
import { formatStartDate } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";

type Props = {
  events: Event[];
};

export const EventsTable = ({ events }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableHead>Title</TableHead>
        <TableHead>Start Date</TableHead>
        <TableHead>Adress</TableHead>
        <TableHead>Count</TableHead>
        <TableHead>Actions</TableHead>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.title}</TableCell>
            <TableCell>{formatStartDate(event.startedAt)}</TableCell>
            <TableCell>{event.address}</TableCell>
            <TableCell>{event.capacity}</TableCell>
            <TableCell className="font-medium">
              <Button variant="link">
                <Link to={`/events/${event.id}`}>View</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
