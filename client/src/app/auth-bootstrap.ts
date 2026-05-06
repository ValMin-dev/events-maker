import { useAuthStore } from "../stores/auth-store";

let bootsrapPromise: Promise<void> | null = null;

export function ensureAuthBootstrap(): Promise<void> {
  if (!bootsrapPromise) {
    bootsrapPromise = useAuthStore.getState().isAuth();
  }
  return bootsrapPromise;
}
