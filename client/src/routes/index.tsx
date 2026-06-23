import { TooltipProvider } from "@/components/ui/tooltip"
import { Outlet, useLoaderData, useOutlet } from "react-router" // Imported useOutlet

import AppSidebar from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SearchBar from "@/components/searchbar"
import { useIsMobile } from "@/hooks/use-mobile"
import { NoteCard } from "@/features/notes/notes.ui"

export default function RootLayout() {
  const isMobile = useIsMobile()
  const notes = useLoaderData()
  const hasActiveChild = !!useOutlet()

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        
        {isMobile ? (
          /* Mobile Viewport: Single-column layout with a view toggle */
          <div className="flex h-screen w-full flex-col overflow-hidden">

            <div className="sticky top-0 z-10 flex h-14 w-full shrink-0 flex-row items-center gap-2 bg-background px-4 shadow-sm">
              <SidebarTrigger variant="outline" size="icon-lg" />
              <SearchBar />
            </div>

            <main className="flex-1 overflow-y-auto p-4">
              {hasActiveChild ? (
                <Outlet /> 
              ) : (
                <div className="flex flex-col gap-3">
                  {notes.map((note : { id: string }) => (
                    <NoteCard key={note.id } note={note} />
                  ))}
                </div>
              )}
            </main>
          </div>
        ) : (
          /* Desktop View Port: double column layout */
          <div className="grid h-screen w-full grid-cols-2 overflow-hidden">
            
            <div className="flex h-screen flex-col overflow-hidden border-r">
              <div className="sticky top-0 z-10 flex h-14 shrink-0 flex-row items-center gap-2 bg-background p-4 shadow-sm">
                <SidebarTrigger variant="outline" size="icon-lg" />
                <SearchBar />
              </div>

              <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {notes.map((note : {id: string}) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </main>
            </div>
            
            <div className="h-screen overflow-y-auto" id="details">
              <Outlet />
            </div>
          </div>
        )}
      </SidebarProvider>
    </TooltipProvider>
  )
}