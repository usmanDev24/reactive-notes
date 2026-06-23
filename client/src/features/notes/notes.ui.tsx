import { Button } from "@/components/ui/button"
import { Link, useLoaderData } from "react-router"
import { EllipsisVertical, Trash2Icon } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
export function NoteCard({ note }) {
  return (
    <div className="group rounded-lg bg-sidebar p-4" key={note.id}>
      <div className="flex flex-row items-center justify-between">
        <Link className=" w-full" to={"/note/view/" + note.id}>
          <h2 className="line-clamp-1 font-mono text-lg font-medium tracking-wide group-hover:text-accent/95">
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
  const note: {
    title: string
    body: string
    id: string
    createdAt: string
  } = useLoaderData()
  return (
    <div className="m-4">
      <div className="flex flex-row items-center justify-between border-b p-2">
        <Button variant={"secondary"}>Edit</Button>
        <Button variant={"destructive"}>Delete</Button>
      </div>
      <article className="p-6">
        <h2 className="pb-4 text-2xl">{note.title}</h2>
        <p>{note.body}</p>
      </article>
    </div>
  )
}
