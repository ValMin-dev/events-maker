import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./router/RootLayout";
import { RootRedirect } from "./router/RootRedirect";
import { GuestRoute } from "./router/GuestRoute";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { AuthRegisterPage } from "../pages/auth/register/page";
import { AuthLoginPage } from "../pages/auth/login/page";
import { EventsAllPage } from "../pages/events/all/page";
import { MyEventsPage } from "../pages/events/my/page";
import { EventDetailsPage } from "../pages/events/details/page";
import { EventCreateForm } from "../pages/events/components/EventCreateForm";
import { EventsEditPage } from "../pages/events/edit/page";

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
          { path: "events", element: <EventsAllPage /> },
          { path: "events/my", element: <MyEventsPage /> },
          { path: "events/new", element: <EventCreateForm /> },
          { path: "events/:id", element: <EventDetailsPage /> },
          { path: "events/:id/edit", element: <EventsEditPage /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
