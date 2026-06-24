// src/Editor.tsx
"use client"

import { Tiptap, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyleKit } from "@tiptap/extension-text-style"
import { useTiptap } from "@tiptap/react"
import { BoldIcon, ItalicIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditorState } from "@tiptap/react"

/**
 * State selector for the MenuBar component.
 * Extracts the relevant editor state for rendering menu buttons.
 */
function menuBarStateSelector(ctx) {
  return {
    // Text formatting
    isBold: ctx.editor.isActive("bold") ?? false,
    canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
    isItalic: ctx.editor.isActive("italic") ?? false,
    canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
    isStrike: ctx.editor.isActive("strike") ?? false,
    canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
    isCode: ctx.editor.isActive("code") ?? false,
    canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
    canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,

    // Block types
    isParagraph: ctx.editor.isActive("paragraph") ?? false,
    isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
    isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
    isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
    isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
    isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
    isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,

    // Lists and blocks
    isBulletList: ctx.editor.isActive("bulletList") ?? false,
    isOrderedList: ctx.editor.isActive("orderedList") ?? false,
    isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
    isBlockquote: ctx.editor.isActive("blockquote") ?? false,

    // History
    canUndo: ctx.editor.can().chain().undo().run() ?? false,
    canRedo: ctx.editor.can().chain().redo().run() ?? false,
  }
}
function MenuBar() {
  const { editor } = useTiptap()
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  })
  
  if (!editor) return null

  return (
    <div className="flex w-full flex-row flex-wrap gap-1">
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editorState.isBold ? "is-active" : ""}
      >
        <BoldIcon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editorState.isItalic ? "is-active" : ""}
      >
        <ItalicIcon />
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
        className={editorState.isStrike ? "is-active" : ""}
      >
        Strike
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editorState.canCode}
        className={editorState.isCode ? "is-active" : ""}
      >
        Code
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        Clear marks
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().clearNodes().run()}
      >
        Clear nodes
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editorState.isParagraph ? "is-active" : ""}
      >
        Paragraph
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editorState.isHeading1 ? "is-active" : ""}
      >
        H1
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editorState.isHeading2 ? "is-active" : ""}
      >
        H2
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editorState.isHeading3 ? "is-active" : ""}
      >
        H3
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editorState.isHeading4 ? "is-active" : ""}
      >
        H4
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editorState.isBulletList ? "is-active" : ""}
      >
        Bullet list
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editorState.isOrderedList ? "is-active" : ""}
      >
        Ordered list
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editorState.isCodeBlock ? "is-active" : ""}
      >
        Code block
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editorState.isBlockquote ? "is-active" : ""}
      >
        Blockquote
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        Horizontal rule
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        Hard break
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
      >
        Undo
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
      >
        Redo
      </Button>
    </div>
  )
}
export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, TextStyleKit],
    content: "<p>Hello World!</p>",
  })

  if (!editor) return null

  return (
    <div className="p-4">
      <Tiptap editor={editor}>
        <div className=" sticky top-0 bg-[#111] rounded-2xl z-10 border-b">
          <MenuBar></MenuBar>
        </div>
        
        <div className=" prose dark:prose-invert prose-p:my-1 prose-h1:mb-4">
          <Tiptap.Content className=" border-0" />
        </div>
        
      </Tiptap>
    </div>
  )
}
