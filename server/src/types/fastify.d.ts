import "@fastify/jwt";
import "fastify";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    payload: { sub: string; email: string };
    user: { id: string; email: string };
  }
}
