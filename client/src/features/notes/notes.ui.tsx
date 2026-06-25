import { Button } from "@/components/ui/button"
import { Form, Link, NavLink, useLoaderData, useLocation } from "react-router"
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
    <NavLink
      to={`/notes/${note.id}`}
      className={({ isActive }) => {
        return isActive
          ? "group border-b bg-accent/20 p-4 px-6 hover:bg-accent/20 dark:bg-accent/10"
          : "group border-b p-4 px-6 hover:bg-accent/10"
      }}
      key={note.id}
    >
      <div className="flex flex-row items-center justify-between">
        <h2 className="line-clamp-2 font-mono text-lg font-medium tracking-wide group-hover:text-accent/95">
          {note.title}
        </h2>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"ghost"} size={"icon-sm"}>
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent align={"end"} className="w-28">
            <Form action={`/notes/${note.id}/delete`} method="post">
              <input hidden name="id" defaultValue={note.id}></input>
              <Button type="submit" variant={"destructive"}>
                <Trash2Icon></Trash2Icon> Delete
              </Button>
            </Form>
          </PopoverContent>
        </Popover>
      </div>
      <div
        className="line-clamp-2 text-foreground/70"
        dangerouslySetInnerHTML={{ __html: note.body }}
      ></div>
    </NavLink>
  )
}
export function NoteDetails() {
  const note = useLoaderData()
  const isMobile = useIsMobile()
  return (
    <div className="mx-auto max-w-3xl">
      {/* Action Header Boundary */}
      {isMobile ? (
        <div className="sticky top-0 flex items-center justify-between border-b border-muted bg-background p-2">
          <BackButton></BackButton>

          <div className="flex flex-row">
            <Link to={`/notes/${note.id}/edit`}>
              <Button variant="secondary" size="sm" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Note
              </Button>
            </Link>
            <Form action={`/notes/${note.id}/delete`} method="post">
              <input hidden name="id" defaultValue={note.id}></input>
              <Button variant="destructive" size="sm" className="ml-2 gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 flex items-center justify-between border-b border-muted bg-background p-2 sm:p-4">
          <Link to={`/notes/${note.id}/edit`}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit Note
            </Button>
          </Link>

          <Form action={`/notes/${note.id}/delete`} method="post">
            <input hidden name="id" defaultValue={note.id}></input>
            <Button variant="destructive" size="sm" className="ml-2 gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </Form>
        </div>
      )}

      {/* Semantic Content Container */}
      <article className="prose max-w-none space-y-4 p-2 sm:p-4">
        <header className="py-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {note.title}
          </h1>

          <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <time className="text-xs">
              Created on {new Date(note.createdAt).toLocaleDateString()}
            </time>
          </div>
        </header>

        {/* Body copy layout supporting paragraph breaks */}
        <div
          dangerouslySetInnerHTML={{ __html: note.body }}
          className="prose leading-7 whitespace-pre-wrap text-muted-foreground dark:prose-invert"
        ></div>
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
