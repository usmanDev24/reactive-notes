import { TooltipProvider } from "@/components/ui/tooltip"
import { Outlet } from "react-router"

import AppSidebar from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SearchBar from "@/components/searchbar"

import { useIsMobile } from "@/hooks/use-mobile"
import { useLoaderData } from "react-router"
import { NoteCard } from "@/features/notes/notes.ui"

export default function RootLayout() {
  const isMobile = useIsMobile()
  const notes: [] = useLoaderData()
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        {isMobile ? (
          <div className="m-4 w-full sm:mx-8">
            <div className="flex h-12 w-full flex-row items-center gap-2">
              <SidebarTrigger variant={"outline"} size={"icon-lg"} />
              <SearchBar></SearchBar>
            </div>
            <main className="mt-4 flex flex-col gap-3">
              {notes.map((note) => {
                return <NoteCard note={note}></NoteCard>
              })}
            </main>
          </div>
        ) : (
          <>
            <div className="grid w-full grid-cols-2 h-screen overflow-hidden ">
              <div className="m-4 h-screen overflow-auto">
                <div className=" flex h-12 flex-row items-center gap-2">
                  <SidebarTrigger variant={"outline"} size={"icon-lg"} />
                  <SearchBar></SearchBar>
                </div>
                <main className="mt-4 flex flex-col gap-3">
                  {notes.map((note) => {
                    return <NoteCard note={note}></NoteCard>
                  })}
                </main>
              </div>
              
              <div className=" border-l" id="details">
                <Outlet />
              </div>
            </div>
          </>
        )}
      </SidebarProvider>
    </TooltipProvider>
  )
}
