import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Link, useLoaderData } from "react-router"

export function NoteCard ({note}) {
  return (
    <Link to={'/note/view/'+note.id}>
    <Card key={note.id}>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription className=" line-clamp-2">{note.body}</CardDescription>
      </CardHeader>
    </Card>
    </Link>
    
  )
}
export function NoteDetails() {
  const  note  : {
    title: string,
    body: string,
    id: string,
    createdAt: string
  } = useLoaderData();
  return (
    <div className="m-4">
      <div className=" flex flex-row items-center justify-between border-b p-2">
        <Button variant={"secondary"}>Edit</Button>
        <Button variant={'destructive'}>Delete</Button>
      </div>
      <article className=" p-6">
        <h2 className=" text-2xl  pb-4">{note.title}</h2>
      <p>{note.body}</p>
      </article>
      
    </div>
  )
}