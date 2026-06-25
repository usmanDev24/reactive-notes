import { useEditor, Tiptap } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyleKit } from "@tiptap/extension-text-style"
import { MenuBar } from "./tiptap-editor"
import { Form, useLoaderData } from "react-router"
import { useNavigate } from "react-router"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, SaveOff } from "lucide-react"

export default function Editor() {
  const note = useLoaderData()
  const bodyInput = useRef(null)
  const [text, setText] = useState(note?.title)
  const editor = useEditor({
    extensions: [StarterKit, TextStyleKit],
    content: note?.body,
    onUpdate: ({ editor }) => {
      if (bodyInput.current) {
        bodyInput.current.value = editor.getHTML()
      }
    },
    editorProps: {
      attributes: {
        // Keeps formatting contained and interactive within the editing element
        class: "focus:outline-none min-h-[150px] p-4",
      },
    },
  })
  const navigate = useNavigate()
  if (!editor) {
    return (
      <div className="animate-pulse rounded-2xl border p-4 text-muted-foreground">
        Loading editor...
      </div>
    )
  }

  return (
    <Form method="post">
      <div className="sticky top-0 z-11 flex items-center justify-between border-b border-muted bg-background p-2 sm:p-4 sm:px-2">
        <div className="flex flex-row items-center">
          <span className="px-2 text-sm">Editing</span>
        </div>
        <div>
          <Button
            onClick={() => {
              navigate(-1)
            }}
            type="button"
            variant="secondary"
            size="sm"
            className="gap-1"
          >
            <SaveOff />
            Discard
          </Button>

          <Button variant="default" size="sm" className="ml-2 gap-1">
            <Save />
            <input type="submit" value={"Save"}></input>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-0">
        <Tiptap editor={editor}>
          <div className="rounded-2xl bg-background shadow-sm">
            <div className="sticky top-10 z-10 sm:top-14">
              <MenuBar />
            </div>
            <input hidden name="id" defaultValue={note?.id}></input>
            <div className="grid h-max w-full auto-rows-min grid-cols-1">
              {/* 1. The Ghost Mirror */}
              {/* Note: The trailing space character ensure empty newlines render text container height accurately */}
              <div
                className="invisible col-start-1 row-start-1  px-3 py-2  text-3xl whitespace-pre-wrap"
                aria-hidden="true"
              >
                {text + (text.endsWith("\n") ? " " : "")}
              </div>

              {/* 2. The Interactive Textarea */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Title"
                className="col-start-1 text-3xl row-start-1 h-full w-full resize-none focus:outline-0 overflow-hidden bg-background px-3 py-4  focus-visible:outline-none"
              />
            </div>
            <input
              hidden
              defaultValue={note?.body}
              name="noteBody"
              ref={bodyInput}
            ></input>
             <span className=" p-4 text-foreground/50">Note Details</span>
            <div className="prose border max-w-none dark:prose-invert prose-h1:mb-4 prose-p:my-1">
              <Tiptap.Content />
            </div>
          </div>
        </Tiptap>
      </div>
    </Form>
  )
}
export function EditorCreate() {
  const bodyInput = useRef(null)
  const editor = useEditor({
    extensions: [StarterKit, TextStyleKit],
    content: "",
    onUpdate: ({ editor }) => {
      if (bodyInput.current) {
        bodyInput.current.value = editor.getHTML()
      }
    },
    editorProps: {
      attributes: {
        // Keeps formatting contained and interactive within the editing element
        class: "focus:outline-none min-h-[150px] p-4",
      },
    },
  })
  const navigate = useNavigate()
  if (!editor) {
    return (
      <div className="animate-pulse rounded-2xl border p-4 text-muted-foreground">
        Loading editor...
      </div>
    )
  }

  return (
    <Form method="post">
      <div className="sticky top-0 z-11 flex items-center justify-between border-b border-muted bg-background p-2 sm:p-4 sm:px-2">
        <div className="flex flex-row items-center">
          <span className="px-2 text-sm">Add New Note</span>
        </div>
        <div>
          <Button
            onClick={() => {
              navigate(-1)
            }}
            type="button"
            variant="secondary"
            size="sm"
            className="gap-1"
          >
            <SaveOff />
            Discard
          </Button>

          <Button variant="default" size="sm" className="ml-2 gap-1">
            <Save />
            <input type="submit" value={"Save"}></input>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-0">
        <Tiptap editor={editor}>
          <div className="rounded-2xl bg-background shadow-sm">
            <div className="sticky top-10 z-10 sm:top-14">
              <MenuBar />
            </div>
            
            <textarea
              defaultValue={""}
              name="title"
              className="h-auto resize-y w-full p-4 text-2xl focus:outline-0"
              placeholder="Title"
            ></textarea>
            <input
              hidden
              defaultValue={""}
              name="noteBody"
              ref={bodyInput}
            ></input>
            <span className=" p-4 text-foreground/50">Note Details</span>
            <div className="prose border max-w-none dark:prose-invert prose-h1:mb-4 prose-p:my-1">
              <Tiptap.Content />
            </div>
          </div>
        </Tiptap>
      </div>
    </Form>
  )
}
