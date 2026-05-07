import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../sidebar";
import { PlusIcon, SquaresExclude } from "lucide-react";

export function AppSidebarNav() {
  const pathName = useLocation().pathname;

  const isCreate = pathName === "/events/new";
  const isMyEvents = pathName === "/events/my";
  const isAllEvents =
    pathName === "/events" ||
    pathName === "/events/" ||
    pathName === "/events/all";

  return (
    <SidebarMenu className="gap-3 px-1">
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          variant={isAllEvents ? "outline" : "default"}
          asChild
          isActive={isAllEvents}
          tooltip="All events"
        >
          <Link to="/events">
            <SquaresExclude className="mr-1" />
            All Events
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          variant={isMyEvents ? "outline" : "default"}
          asChild
          isActive={isMyEvents}
          tooltip="My events"
        >
          <Link to="/events/my">
            <SquaresExclude className="mr-1" />
            My Events
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          variant={isCreate ? "outline" : "default"}
          className={`min-h-12 py-3 bg-primary text-primary-foreground hover:bg-primary/10`}
          asChild
          isActive={isCreate}
          tooltip="Create event"
        >
          <Link to="/events/new">
            <PlusIcon className="mr-1" />
            Create Event
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
