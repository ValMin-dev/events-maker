import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777553064413 implements MigrationInterface {
    name = 'InitSchema1777553064413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "copacity" integer NOT NULL, "address" character varying(255) NOT NULL, "starterdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "ownerId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventId" uuid NOT NULL, "userId" uuid NOT NULL, "joinedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_b65ffd558d76fd51baffe81d42b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_EVENT_PARTICIPANT_EVENT_USER" ON "event_participants" ("eventId", "userId") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_72bbe49600962f125177d7d6b68" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_participants" ADD CONSTRAINT "FK_4907f15416577c3bbbcd604d121" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_participants" ADD CONSTRAINT "FK_d1b1a40ec360951071605b0f7a0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_participants" DROP CONSTRAINT "FK_d1b1a40ec360951071605b0f7a0"`);
        await queryRunner.query(`ALTER TABLE "event_participants" DROP CONSTRAINT "FK_4907f15416577c3bbbcd604d121"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_72bbe49600962f125177d7d6b68"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_EVENT_PARTICIPANT_EVENT_USER"`);
        await queryRunner.query(`DROP TABLE "event_participants"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
