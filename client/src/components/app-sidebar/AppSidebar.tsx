import { useAuthStore } from "../../stores/auth-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "../../components/ui/sidebar";
import { AppSidebarBrand } from "./AppSidebarBrand";
import { AppSidebarFooter } from "./AppSidebarFooter";
import { AppSidebarNav } from "./AppSidebarNav";

export function AppSidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { state } = useSidebar();

  if (!user) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <AppSidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        {state === "collapsed" && (
          <button
            onClick={logout}
            className="w-full rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Вихід
          </button>
        )}

        <AppSidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter
          user={user}
          sidebarExpanded={state === "expanded"}
          onLogout={() => logout()}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
