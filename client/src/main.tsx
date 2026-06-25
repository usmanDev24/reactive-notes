import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import RootLayout from "./routes/index"
import { createBrowserRouter, redirect } from "react-router"
import { RouterProvider } from "react-router/dom"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import ErrorPage from "./features/errorpage"
import { allNotesLoader, createAction, deleteAction, noteLoader } from "./features/notes/notes.data"
import { NoteDetails } from "./features/notes/notes.ui"
import Editor, { EditorCreate } from "./features/editor/edit.ui"
import { action as editAction } from "./features/editor/edit.data"
import { Loader2Icon } from "lucide-react"
const router = createBrowserRouter([
  {
    path: "/", 
    loader: () => redirect("/notes"),
    element: <div></div>, 
    hydrateFallbackElement: <div></div>
  },
  {
    path: '/notes',
    element: <RootLayout/>,
    loader: allNotesLoader,
    hydrateFallbackElement: <div className=" h-screen w-screen flex flex-col justify-around items-center "><Loader2Icon/></div>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { 
        path: "/notes/:id",
        element: <NoteDetails ></NoteDetails>,
        loader: noteLoader,
      },
      {
        path: "/notes/create",
        element: <EditorCreate/>,
        action: createAction, 
        
      },
      {
        path: "/notes/:id/edit",
        action: editAction,
        loader: noteLoader,
        element : <Editor/>
      }, 
      {
        path: "/notes/:id/delete",
        action: deleteAction
      }
    ]
  }
])
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  </StrictMode>
)
