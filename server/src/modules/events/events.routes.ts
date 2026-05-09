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
      message: "Events retrieved successfully",
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
          message: "Event not found",
        });
      }
      const userId = request.user.sub;
      if (event.ownerId !== userId) {
        return reply.status(403).send({
          message: "Forbidden: You are not the owner of this event",
        });
      }
      await participantsRepository.delete({ eventId: id });
      await eventRepository.delete({ id: id });
      return reply.status(200).send({
        message: "Event deleted successfully",
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
        message: "Event not found",
      });
    }
    return reply.status(200).send({
      message: "Event retrieved successfully",
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
          message: "Event not found",
        });
      }
      const userId = request.user.sub;
      if (event.ownerId !== userId) {
        return reply.status(403).send({
          message: "Forbidden: You are not the owner of this event",
        });
      }
      const parseBody = editEventSchema.safeParse(request.body);
      if (!parseBody.success) {
        return reply.status(400).send({
          message: "Invalid request body",
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
        message: "Event updated successfully",
        event: updatedEvent,
      });
    },
  );

  app.post("/", { preHandler: [app.authenticate] }, async (request, reply) => {
    const parseBody = createEventSchema.safeParse(request.body);
    if (!parseBody.success) {
      return reply.status(400).send({
        message: "Invalid request body",
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
      message: "Event created successfully",
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
          message: "Event not found",
        });
      }
      const userId = request.user.sub;
      const existingParticipant = await participantsRepository.findOne({
        where: { eventId: id, userId: userId },
      });
      if (existingParticipant) {
        return reply.status(400).send({
          message: "You have already joined this event",
        });
      }
      const participantCount = await participantsRepository.count({
        where: { eventId: id },
      });
      if (participantCount >= event.capacity) {
        return reply.status(400).send({
          message: "Event is at full capacity",
        });
      }
      const newParticipant = participantsRepository.create({
        eventId: id,
        userId: userId,
        joinedAt: new Date(),
      });
      await participantsRepository.save(newParticipant);
      return reply.status(200).send({
        message: "Joined event successfully",
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
          message: "Event not found",
        });
      }
      const participants = await participantsRepository.find({
        where: { eventId: id },
        relations: ["user"],
      });
      return reply.status(200).send({
        message: "Participants retrieved successfully",
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
          message: "Event not found",
        });
      }
      const userId = request.user.sub;
      const participant = await participantsRepository.findOne({
        where: { eventId: id, userId: userId },
      });
      if (!participant) {
        return reply.status(404).send({
          message: "You are not a participant of this event",
        });
      }
      await participantsRepository.remove(participant);
      return reply.status(200).send({
        message: "Left event successfully",
      });
    },
  );
};
