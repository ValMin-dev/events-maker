import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";

if (!baseURL) {
  throw new Error("VITE_API_URL не визначено в змінних середовища");
}

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("events-auth-token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export type ApiValidationError = {
  message: string;
  errors: Array<{ path: string; message: string }>;
};

export function isAxiosError<T = unknown>(
  error: unknown,
): error is AxiosError<T> {
  return axios.isAxiosError(error);
}
