import { TooltipProvider } from "@/components/ui/tooltip"
import { Outlet } from "react-router"

import AppSidebar from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SearchBar from "@/components/searchbar"
import { Separator } from "@/components/ui/separator"
export default function RootLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="grid grid-cols-1 md:grid-cols-2 w-full">
          <div className="m-4 flex h-12  flex-row items-center gap-2">
            <SidebarTrigger variant={"outline"} size={"icon-lg"} />
            <SearchBar></SearchBar>
            
          </div>
          <Separator orientation="vertical"/>
        </div>

        <Outlet></Outlet>
      </SidebarProvider>
    </TooltipProvider>
  )
}
