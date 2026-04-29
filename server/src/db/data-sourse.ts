import { DataSource } from "typeorm";
import { env } from "../../config/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: ["src/db/entities/**/*.ts"],
  migrations: ["src/db/migrations/**/*.ts"],
  subscribers: [],
});
