import { LogOut } from "lucide-react";
import { getUserInitials } from "../../lib/utils";
import type { UserPublic } from "../../shared/api/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

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
        <SidebarMenuButton
          className="cursor-pointer"
          variant="outline"
          onClick={() => onLogout()}
          tooltip="Вихід"
        >
          <LogOut className="mr-1" />
          Вихід
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
