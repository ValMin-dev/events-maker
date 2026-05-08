import { LogOut } from "lucide-react";
import { getUserInitials } from "../../lib/utils";
import type { UserPublic } from "../../shared/api/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { eventsApi } from "../../shared/api/events-api";
import { meApi } from "../../shared/api/me-api";

type Props = {
  user: UserPublic;
  sidebarExpanded: boolean;
  onLogout: () => void;
};

export function AppSidebarFooter({ user, sidebarExpanded, onLogout }: Props) {
  return (
    <SidebarMenu className="gap-2 px-1">
      {sidebarExpanded ? (
        <SidebarMenuItem>
          <div className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1 text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg text-xs">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-h-0 flex-1">
              <p className="truncate text-sm font-medium ">{user.name}</p>
              <p className="truncate text-sm font-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </SidebarMenuItem>
      ) : null}

      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => onLogout()} tooltip="Exit">
          <LogOut className="mr-1" />
          Logout
        </SidebarMenuButton>

        <SidebarMenuButton
          onClick={() => eventsApi.getAll()}
          tooltip="Get Events"
        >
          <LogOut className="mr-1" />
          Get Events
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={() => meApi.joinedEvents()}
          tooltip="Get Joined Events"
        >
          <LogOut className="mr-1" />
          Get Joined Events
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={() =>
            eventsApi.getById("436fc835-fbe9-4e89-8ed9-c401e2579241")
          }
          tooltip="Get Event by ID"
        >
          <LogOut className="mr-1" />
          Get Event by ID
        </SidebarMenuButton>

        <SidebarMenuButton
          onClick={() => eventsApi.join("436fc835-fbe9-4e89-8ed9-c401e2579241")}
          tooltip="Join Event"
        >
          <LogOut className="mr-1" />
          Join Event
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={() =>
            eventsApi.leave("436fc835-fbe9-4e89-8ed9-c401e2579241")
          }
          tooltip="Leave Event"
        >
          <LogOut className="mr-1" />
          Leave Event
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={() =>
            eventsApi.getParticipants("436fc835-fbe9-4e89-8ed9-c401e2579241")
          }
          tooltip="Get Participants"
        >
          <LogOut className="mr-1" />
          Get Participants
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={() =>
            eventsApi.update("436fc835-fbe9-4e89-8ed9-c401e2579241", {
              title: "New Title for Event EDITING",
              description: "New Description for Event EDITING",
              capacity: 100,
              address: "New Address for Event EDITING",
              startedAt: new Date().toISOString(),
            })
          }
          tooltip="Update Event"
        >
          <LogOut className="mr-1" />
          Update Event
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={() =>
            eventsApi.delete("436fc835-fbe9-4e89-8ed9-c401e2579241")
          }
          tooltip="Delete Event"
        >
          <LogOut className="mr-1" />
          Delete Event
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={() =>
            eventsApi.create({
              title: `New Event of user ${user.name}`,
              description: "Event Description",
              capacity: 100,
              address: "Event Address",
              startedAt: new Date().toISOString(),
            })
          }
          tooltip="Create Event"
        >
          <LogOut className="mr-1" />
          Create Event
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
