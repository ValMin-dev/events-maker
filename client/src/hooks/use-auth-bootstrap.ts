import { useAuthStore } from "../stores/auth-store";

export function useAuthBootstrap() {
  return useAuthStore((state) => state.user);
}
