import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import "dotenv/config";
import "reflect-metadata";
import { AppDataSource } from "./db/data-sourse";
import { env, validateEnv } from "../config/env";

const app = fastify({ logger: true });

app.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ message: "Unauthorized" });
  }
});

const start = async () => {
  try {
    validateEnv();
    await AppDataSource.initialize();
    app.log.info("Database connected successfully");

    await app.register(cors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    await app.register(fastifyJwt, {
      secret: env.JWT_SECRET,
    });
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Server is running at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    app.log.error(err);
    process.exit(1);
  }
};

start();
