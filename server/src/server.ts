import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import "dotenv/config";
import "reflect-metadata";
import { AppDataSource } from "./db/data-sourse";
import { env, validateEnv } from "../config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { eventsRoutes } from "./modules/events/events.routes";
import { meRoutes } from "./modules/me/me.routes";

const app = fastify({ logger: true });

app.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ message: "Неавторизовано" });
  }
});

const start = async () => {
  try {
    validateEnv();
    await AppDataSource.initialize();
    app.log.info("Базу даних успішно підключено");

    await app.register(cors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    await app.register(fastifyJwt, {
      secret: env.JWT_SECRET,
    });

    await app.register(eventsRoutes, { prefix: "/events" });

    await app.register(authRoutes, { prefix: "/auth" });

    await app.register(meRoutes, { prefix: "/me" });

    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Сервер запущено за адресою http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    app.log.error(err);
    process.exit(1);
  }
};

start();
