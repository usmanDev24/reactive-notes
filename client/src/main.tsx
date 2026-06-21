import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import Root from "./Root.tsx"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import { ThemeProvider } from "@/components/theme-provider.tsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root></Root>
  }
])
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  </StrictMode>
)
