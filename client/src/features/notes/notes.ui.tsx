import { Button } from "@/components/ui/button"
import { Link, useLoaderData, useLocation } from "react-router"
import {
  EllipsisVertical,
  Trash2Icon,
  Trash2,
  Pencil,
  Calendar,
  ArrowLeft,
} from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

import { useIsMobile } from "@/hooks/use-mobile"

export function NoteCard({ note }) {
  return (
    <div className="group rounded-lg bg-sidebar p-4" key={note.id}>
      <div className="flex flex-row items-center justify-between">
        <Link className="w-full" to={"/notes/" + note.id}>
          <h2 className="line-clamp-2 font-mono text-lg font-medium tracking-wide group-hover:text-accent/95">
            {note.title}
          </h2>
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"ghost"} size={"icon-sm"}>
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent align={"end"} className="w-28">
            <Button variant={"destructive"}>
              <Trash2Icon></Trash2Icon> Delete
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-foreground/80">{note.body}</p>
    </div>
  )
}
export function NoteDetails() {
  const note = useLoaderData()
  const isMobile = useIsMobile()
  return (
    <div className="mx-auto max-w-3xl p-4">
      {/* Action Header Boundary */}
      {isMobile ? (
        <div className="flex items-center justify-between border-b border-muted pb-4">
          <BackButton></BackButton>

          <div>
            <Link to={`/notes/${note.id}/edit`}>
              <Button variant="secondary" size="sm" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Note
              </Button>
            </Link>

            <Button variant="destructive" size="sm" className="ml-2 gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-muted pb-4">
          <Link to={`/notes/${note.id}/edit`}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit Note
            </Button>
          </Link>

          <Button variant="destructive" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}

      {/* Semantic Content Container */}
      <article className="prose max-w-none space-y-4">
        <header className="py-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {note.title}
          </h1>

          <div className="flex items-center mt-1 gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <time className="text-xs">
              Created on {new Date(note.createdAt).toLocaleDateString()}
            </time>
          </div>
        </header>

        {/* Body copy layout supporting paragraph breaks */}
        <p className="text-base leading-7 whitespace-pre-wrap text-muted-foreground">
          {note.body}
        </p>
      </article>
    </div>
  )
}
function BackButton() {
  const url = useLocation()
  const paths = url.pathname.split("/")
  const backUrl = paths.slice(0, -1).join("/")
  if (backUrl == "") return ""
  return (
    <Link to={backUrl}>
      <Button variant={"outline"} size={"sm"} className="">
        <ArrowLeft />
      </Button>
    </Link>
  )
}
