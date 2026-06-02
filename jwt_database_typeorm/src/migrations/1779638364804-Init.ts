import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779638364804 implements MigrationInterface {
    name = 'Init1779638364804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user', \`active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
