import { Link } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../sidebar";
import { Calendar1 } from "lucide-react";

export function AppSidebarBrand() {
  return (
    <SidebarMenu className="gap-2 px-1">
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link to="/events" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Calendar1 />
            </span>
            <span className="font-heading font-semibold">Events Hub</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
