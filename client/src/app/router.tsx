import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./router/RootLayout";
import { RootRedirect } from "./router/RootRedirect";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ index: true, element: <RootRedirect /> }],
  },
]);
