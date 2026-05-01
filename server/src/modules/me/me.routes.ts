import { FastifyInstance } from "fastify";
import { AppDataSource } from "../../db/data-sourse";
import { User } from "../../db/entities/user.entity";

export const meRoutes = async (app: FastifyInstance) => {
  const userRepository = AppDataSource.getRepository(User);
  const participantsRepository =
    AppDataSource.getRepository("EventParticipant");

  app.get(
    "/events/joined",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const participations = await participantsRepository.find({
        where: { userId: request.user.sub },
        relations: ["event"],
        order: {
          joinedAt: "DESC",
        },
      });
      const events = participations.map((p) => p.event);
      return reply.send({
        events,
      });
    },
  );

  app.get("/", { preHandler: [app.authenticate] }, async (request, reply) => {
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
