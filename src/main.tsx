import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, replace, RouterProvider } from "react-router-dom"

import App from "./App.tsx"
import Content from "./components/Content.tsx"
import "./index.css"
import MainPage from "./pages/MainPage.tsx"
import NotFound from "./pages/NotFound.tsx"

const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      errorElement: <NotFound />,
      children: [
         {
            index: true,
            loader: () => replace("/main"),
         },
         {
            path: "/main",
            element: <MainPage />,
            children: [
               {
                  path: "tabs/:tabId",
                  element: <Content />,
               },
            ],
         },
      ],
   },
])

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <RouterProvider router={router} />
   </StrictMode>
)
