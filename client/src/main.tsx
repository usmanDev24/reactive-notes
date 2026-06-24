import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import RootLayout from "./routes/index"
import { createBrowserRouter, redirect } from "react-router"
import { RouterProvider } from "react-router/dom"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import ErrorPage from "./features/errorpage"
import { allNotesLoader, noteLoader } from "./features/notes/notes.data"
import { NoteDetails } from "./features/notes/notes.ui"
import Editor from "./features/editor/edit.ui"

const router = createBrowserRouter([
  {
    path: "/", 
    loader: () => redirect("/notes")
  },

  {
    path: '/notes',
    element: <RootLayout/>,
    loader: allNotesLoader,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { 
        path: "/notes/:id",
        element: <NoteDetails ></NoteDetails>,
        loader: noteLoader,
        
      },
      {
        path: "/notes/:id/edit",
        element : <Editor></Editor>
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
