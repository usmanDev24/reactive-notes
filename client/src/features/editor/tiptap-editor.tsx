"use client"

import { useTiptap, useTiptapState } from "@tiptap/react"

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Terminal,
  Quote,
  Minus,
  CornerDownLeft,
  Undo2,
  Redo2,
  Eraser,
  RemoveFormatting,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function MenuBar() {
  const { editor } = useTiptap()

  // Subscribe to editor state updates safely using the new useTiptapState hook
  const state = useTiptapState((state) => {
    if (!state.editor) {
      return {
        isBold: false,
        canStrike: false,
        isItalic: false,
        canItalic: false,
        isStrike: false,
        isCode: false,
        canCode: false,
        isParagraph: false,
        isHeading1: false,
        isHeading2: false,
        isHeading3: false,
        isHeading4: false,
        isBulletList: false,
        isOrderedList: false,
        isCodeBlock: false,
        isBlockquote: false,
        canUndo: false,
        canRedo: false,
      }
    }

    return {
      isBold: state.editor.isActive("bold"),
      isItalic: state.editor.isActive("italic"),
      isStrike: state.editor.isActive("strike"),
      canStrike: state.editor?.can()?.chain().toggleStrike().run(),
      isCode: state.editor.isActive("code"),
      canCode: state.editor?.can()?.chain().toggleCode().run(),
      isParagraph: state.editor.isActive("paragraph"),
      isHeading1: state.editor.isActive("heading", { level: 1 }),
      isHeading2: state.editor.isActive("heading", { level: 2 }),
      isHeading3: state.editor.isActive("heading", { level: 3 }),
      isHeading4: state.editor.isActive("heading", { level: 4 }),
      isBulletList: state.editor.isActive("bulletList"),
      isOrderedList: state.editor.isActive("orderedList"),
      isCodeBlock: state.editor.isActive("codeBlock"),
      isBlockquote: state.editor.isActive("blockquote"),
      canUndo: state.editor?.can()?.chain().undo().run(),
      canRedo: state.editor?.can()?.chain().redo().run(),
    }
  })

  if (!editor) return null

  return (
    <div className="flex w-full flex-row flex-wrap gap-1 rounded-t-2xl border-b bg-background p-2">
      <Button
        variant={state.isBold ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isItalic ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isStrike ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!state.canStrike}
        title="Strike"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isCode ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!state.canCode}
        title="Code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="Clear Marks"
      >
        <Eraser className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().clearNodes().run()}
        title="Clear Nodes"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isParagraph ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        Paragraph
      </Button>

      <Button
        variant={state.isHeading1 ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="H1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isHeading2 ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="H2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isHeading3 ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="H3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isHeading4 ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        title="H4"
      >
        <Heading4 className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isBulletList ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isOrderedList ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isCodeBlock ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
      >
        <Terminal className="h-4 w-4" />
      </Button>

      <Button
        variant={state.isBlockquote ? "secondary" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().setHardBreak().run()}
        title="Hard Break"
      >
        <CornerDownLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
