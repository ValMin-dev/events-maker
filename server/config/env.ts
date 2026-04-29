import { config } from "dotenv";

config();

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "0.0.0.0",
  JWT_SECRET: process.env.JWT_SECRET || "",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/events_maker",
};

export const validateEnv = () => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  if (!env.PORT) {
    throw new Error("PORT is not defined");
  }
  if (!env.HOST) {
    throw new Error("HOST is not defined");
  }
  if (!env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined");
  }
};
