import { MigrationInterface, QueryRunner } from "typeorm";

export class TeamMigration1654758038851 implements MigrationInterface {
  name = "TeamMigration1654758038851";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "managerId" integer, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_82b816660e91be06f88e130a99b" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_82b816660e91be06f88e130a99b"`
    );
    await queryRunner.query(`DROP TABLE "team"`);
  }
}
