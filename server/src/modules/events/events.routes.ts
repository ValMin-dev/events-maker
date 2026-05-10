import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../db/data-sourse";
import { createEventSchema, editEventSchema } from "./event.schemas";
import { Event as EventEntity } from "../../db/entities/event.entity";
import { EventParticipant } from "../../db/entities/event-participant.entity";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
  const eventRepository = AppDataSource.getRepository(EventEntity);
  const participantsRepository = AppDataSource.getRepository(EventParticipant);

  app.get("/", async (request, reply) => {
    const events = await eventRepository.find({
      order: {
        startedAt: "ASC",
      },
    });
    return reply.status(200).send({
      message: "Події успішно отримано",
      events,
    });
  });

  app.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const event = await eventRepository.findOne({ where: { id: id } });
      if (!event) {
        return reply.status(404).send({
          message: "Подію не знайдено",
        });
      }
      const userId = request.user.sub;
      if (event.ownerId !== userId) {
        return reply.status(403).send({
          message: "Заборонено: ви не є власником цієї події",
        });
      }
      await participantsRepository.delete({ eventId: id });
      await eventRepository.delete({ id: id });
      return reply.status(200).send({
        message: "Подію успішно видалено",
      });
    },
  );

  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const event = await eventRepository.findOne({
      where: { id: id },
      relations: ["participants"],
    });
    if (!event) {
      return reply.status(404).send({
        message: "Подію не знайдено",
      });
    }
    return reply.status(200).send({
      message: "Подію успішно отримано",
      event,
    });
  });

  app.patch<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const event = await eventRepository.findOne({ where: { id: id } });
      if (!event) {
        return reply.status(404).send({
          message: "Подію не знайдено",
        });
      }
      const userId = request.user.sub;
      if (event.ownerId !== userId) {
        return reply.status(403).send({
          message: "Заборонено: ви не є власником цієї події",
        });
      }
      const parseBody = editEventSchema.safeParse(request.body);
      if (!parseBody.success) {
        return reply.status(400).send({
          message: "Некоректне тіло запиту",
        });
      }
      const { title, description, capacity, address, startedAt } =
        parseBody.data;

      // Обновляем только те поля, которые были переданы в запросе, чтобы не отправлять повторно не обновленные поля
      if (title !== undefined) event.title = title;
      if (description !== undefined) event.description = description;
      if (capacity !== undefined) event.capacity = Number(capacity);
      if (address !== undefined) event.address = address;
      if (startedAt !== undefined) event.startedAt = startedAt;
      const updatedEvent = await eventRepository.save(event);
      return reply.status(200).send({
        message: "Подію успішно оновлено",
        event: updatedEvent,
      });
    },
  );

  app.post("/", { preHandler: [app.authenticate] }, async (request, reply) => {
    const parseBody = createEventSchema.safeParse(request.body);
    if (!parseBody.success) {
      return reply.status(400).send({
        message: "Некоректне тіло запиту",
      });
    }

    const { title, description, capacity, address, startedAt } = parseBody.data;
    const ownerId = request.user.sub;

    const newEvent = eventRepository.create({
      title,
      description,
      capacity: Number(capacity),
      address,
      startedAt,
      ownerId: ownerId,
    });
    const savedEvent = await eventRepository.save(newEvent);

    return reply.status(201).send({
      message: "Подію успішно створено",
      event: savedEvent,
    });
  });

  app.post<{ Params: { id: string } }>(
    "/:id/join",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const event = await eventRepository.findOne({ where: { id: id } });
      if (!event) {
        return reply.status(404).send({
          message: "Подію не знайдено",
        });
      }
      const userId = request.user.sub;
      const existingParticipant = await participantsRepository.findOne({
        where: { eventId: id, userId: userId },
      });
      if (existingParticipant) {
        return reply.status(400).send({
          message: "Ви вже приєдналися до цієї події",
        });
      }
      const participantCount = await participantsRepository.count({
        where: { eventId: id },
      });
      if (participantCount >= event.capacity) {
        return reply.status(400).send({
          message: "Подія вже заповнена",
        });
      }
      const newParticipant = participantsRepository.create({
        eventId: id,
        userId: userId,
        joinedAt: new Date(),
      });
      await participantsRepository.save(newParticipant);
      return reply.status(200).send({
        message: "Ви успішно приєдналися до події",
      });
    },
  );

  app.get<{ Params: { id: string } }>(
    "/:id/participants",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const event = await eventRepository.findOne({ where: { id: id } });
      if (!event) {
        return reply.status(404).send({
          message: "Подію не знайдено",
        });
      }
      const participants = await participantsRepository.find({
        where: { eventId: id },
        relations: ["user"],
      });
      return reply.status(200).send({
        message: "Учасників успішно отримано",
        participants: participants.map((participant) => ({
          id: participant.id,
          userId: participant.userId,
          userEmail: participant.user.email,
          userName: participant.user.name,
          joinedAt: participant.joinedAt,
        })),
      });
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/:id/leave",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const event = await eventRepository.findOne({ where: { id: id } });
      if (!event) {
        return reply.status(404).send({
          message: "Подію не знайдено",
        });
      }
      const userId = request.user.sub;
      const participant = await participantsRepository.findOne({
        where: { eventId: id, userId: userId },
      });
      if (!participant) {
        return reply.status(404).send({
          message: "Ви не є учасником цієї події",
        });
      }
      await participantsRepository.remove(participant);
      return reply.status(200).send({
        message: "Ви успішно покинули подію",
      });
    },
  );
};
