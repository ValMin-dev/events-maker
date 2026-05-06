import { use } from "react";
import { ensureAuthBootstrap } from "../app/auth-bootstrap";
import { useAuthStore } from "../stores/auth-store";

export function useAuthBootstrap() {
  use(ensureAuthBootstrap());

  return useAuthStore((state) => state.user);
}
