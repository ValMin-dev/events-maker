import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouterProvider } from "./app/AppRouterProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouterProvider />
  </StrictMode>,
);
