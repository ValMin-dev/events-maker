import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./router/RootLayout";
import { RootRedirect } from "./router/RootRedirect";
import { GuestRoute } from "./router/GuestRoute";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { AuthRegisterPage } from "../pages/auth/register/page";
import { AuthLoginPage } from "../pages/auth/login/page";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <RootRedirect /> },
      {
        element: <GuestRoute />,
        children: [
          { path: "login", element: <AuthLoginPage /> },
          { path: "register", element: <AuthRegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "events", element: <div>EventsPage</div> },
          { path: "events/my", element: <div>My Events</div> },
          { path: "events/new", element: <div>New Event</div> },
          { path: "events/:id", element: <div>Event Details</div> },
          { path: "events/:id/edit", element: <div>Edit Event</div> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
