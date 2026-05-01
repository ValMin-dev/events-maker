import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../db/data-sourse";
import { User } from "../../db/entities/user.entity";
import { loginSchema, registerSchema } from "./auth.schemas";
import argon2 from "argon2";

export const authRoutes: FastifyPluginAsync = async (app) => {
  const userRepository = AppDataSource.getRepository(User);

  app.post("/register", async (request, reply) => {
    const parseBody = registerSchema.safeParse(request.body);
    if (!parseBody.success) {
      return reply.status(400).send({
        message: "Invalid request body",
      });
    }
    const { email, password, name } = parseBody.data;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({
        message: "Email is already registered",
      });
    }
    const passwordHash = await argon2.hash(password);
    const newUser = userRepository.create({
      email,
      passwordHash,
      name,
    });
    const savedUser = await userRepository.save(newUser);
    const token = app.jwt.sign({ sub: savedUser.id, email: savedUser.email });

    return reply.status(201).send({
      message: "User registered successfully",
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      },
    });
  });

  app.post("/login", async (request, reply) => {
    const parseBody = loginSchema.safeParse(request.body);
    if (!parseBody.success) {
      return reply.status(400).send({
        message: "Invalid request body",
      });
    }
    const { email, password } = parseBody.data;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return reply.status(400).send({
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return reply.status(400).send({
        message: "Invalid email or password",
      });
    }
    const token = app.jwt.sign({ sub: user.id, email: user.email });

    return reply.send({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  });
  app.post("/all", async (request, reply) => {
    const users = await userRepository.find();
    return reply.send({
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        passwordHash: user.passwordHash,
      })),
    });
  });

  app.get("/me", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub: id } = request.user;
    const user = await userRepository.findOne({ where: { id: id } });
    if (!user) {
      return reply.status(404).send({
        message: "User not found",
      });
    }
    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  });
};
