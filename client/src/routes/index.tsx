import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Outlet,
  useLoaderData,
  useOutlet,
  useLocation,
  Link,
} from "react-router" // Imported useOutlet

import { PenLine, TextIcon } from "lucide-react"
import AppSidebar from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SearchBar from "@/components/searchbar"
import { useIsMobile } from "@/hooks/use-mobile"
import { NoteCard } from "@/features/notes/notes.ui"
import { Button } from "@/components/ui/button"

function FolderHeader() {
  const heading = useLocation().pathname.split("/")[1]
  if (heading) {
    return (
      <h1 className="flex items-center gap-2 text-lg font-bold uppercase">
        <TextIcon size={"22"} /> {heading}
      </h1>
    )
  } else return ""
}
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
          <div className="flex h-screen w-full flex-col gap-2 overflow-hidden">
            <main className="flex-1 scrollbar-thin scrollbar-thumb-foreground/40 overflow-y-auto [&::-webkit-scrollbar]:w-1">
              {hasActiveChild ? (
                <Outlet />
              ) : (
                <>
                  <div className="sticky z-10 flex h-23 shrink-0 flex-col items-center gap-2 bg-background p-4 shadow-lg shadow-background">
                    <div className="flex w-full flex-row items-center justify-between">
                      <div className="flex flex-row gap-4">
                        <p className="rounded-2xl bg-secondary p-1">
                          <SidebarTrigger />
                        </p>
                        <FolderHeader />
                      </div>
                      <Link to="/notes/create">
                        <Button variant={"default"}>
                          <PenLine /> Add
                        </Button>
                      </Link>
                    </div>
                    <SearchBar />
                  </div>
                  <div className="flex flex-col gap-0 pt-4">
                    {notes.map((note: { id: string }) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </>
              )}
            </main>
          </div>
        ) : (
          /* Desktop View Port: double column layout */
          <div className="grid h-screen w-full grid-cols-2">
            <div className="flex h-screen flex-col gap-2 border-r">
              <div className="sticky z-10 flex h-23 shrink-0 flex-col items-center gap-2 bg-background p-4 shadow-xl shadow-background">
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger
                      className="bg-secondary p-2"
                      size={"icon-lg"}
                    />
                    <FolderHeader />
                  </div>
                  <Link to="/notes/create">
                    <Button variant={"default"}>
                      <PenLine /> Add
                    </Button>
                  </Link>
                </div>
                <SearchBar />
              </div>

              <main className="flex flex-1 scrollbar-thin scrollbar-thumb-foreground/40 flex-col gap-0 overflow-y-auto pt-4 [&::-webkit-scrollbar]:w-1">
                {notes.map((note: { id: string }) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </main>
            </div>
            {hasActiveChild ? (
              <div
                className="h-screen scrollbar-thin scrollbar-thumb-foreground/40 overflow-y-auto [&::-webkit-scrollbar]:w-1"
                id="details"
              >
                <Outlet />
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-around">
                <h2 className="text-2xl">Select a Note to view</h2>
              </div>
            )}
          </div>
        )}
      </SidebarProvider>
    </TooltipProvider>
  )
}
