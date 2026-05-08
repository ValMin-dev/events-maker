import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAxiosError } from "../shared/api/http";
import type { ApiErrorResponse } from "../shared/api/types";
import { format, isValid, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DATETIME_LOCAL_INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm";

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    if (data && typeof data.message === "string") {
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}

export function getUserInitials(name: string | null | undefined) {
  const normalizedName = String(name ?? "").trim();
  if (!normalizedName) return "?";

  const names = normalizedName.split(/\s+/);
  if (names.length === 0) return "?";
  if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
  return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
}

export function formatStartDate(dateString: string) {
  const date = parseISO(dateString);
  if (isValid(date)) {
    return format(date, "PPp", { locale: enUS });
  }
  return "Invalid date";
}
