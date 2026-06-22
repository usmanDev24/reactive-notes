import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "./ui/sidebar"
import { NotebookIcon, FolderIcon, NotebookPenIcon } from "lucide-react"
import { Link } from "react-router"

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* 1. ELEVATED HEADER DESIGN */}
      <SidebarHeader className="border-b border-sidebar-border/50 py-4 px-3">
        <div className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          {/* Beautifully scaled, colored wrapper for the prominent icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <NotebookPenIcon className="h-5 w-5" />
          </div>
          {/* Dynamic text: smooth fade-out behavior when sidebar collapses */}
          <span className="font-semibold text-sidebar-foreground tracking-tight text-sm truncate group-data-[collapsible=icon]:hidden">
            DevNotes
          </span>
        </div>
      </SidebarHeader>

      {/* 2. NAVIGATION CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className=" text-xs font-medium ">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent className="">
            <SidebarMenu>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link to="/notes" className="gap-3">
                    <NotebookIcon className="h-4 w-4" />
                    <span className="font-medium text-sm">All Notes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/notes/folders" className="gap-3">
                    <FolderIcon className="h-4 w-4" />
                    <span className="font-medium text-sm">Folders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Ready for user settings or profile layouts */}
      </SidebarFooter>
    </Sidebar>
  )
}