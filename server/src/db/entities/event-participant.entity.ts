import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { User } from "./user.entity";
@Entity("event_participants")
@Index("UQ_EVENT_PARTICIPANT_EVENT_USER", ["eventId", "userId"], {
  unique: true,
})
export class EventParticipant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Event, (event) => event.participants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "eventId" })
  event!: Event;

  @Column({ type: "uuid" })
  eventId!: string;

  @ManyToOne(() => User, (user) => user.eventParticipations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "timestamptz" })
  joinedAt!: Date;

  @OneToMany(() => EventParticipant, (participant) => participant.event)
  participants!: EventParticipant[];
}
