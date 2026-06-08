import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780328558021 implements MigrationInterface {
    name = 'Init1780328558021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`locations\` DROP FOREIGN KEY \`locations_province_id_foreign\``);
        await queryRunner.query(`DROP INDEX \`provinces_code_unique\` ON \`provinces\``);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`locations\` CHANGE \`id\` \`id\` bigint UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`province_id\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`province_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`provinces\` CHANGE \`id\` \`id\` bigint UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD CONSTRAINT \`FK_b02683eefd239a9fd4883721d4b\` FOREIGN KEY (\`province_id\`) REFERENCES \`provinces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`locations\` DROP FOREIGN KEY \`FK_b02683eefd239a9fd4883721d4b\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD \`code\` char(2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD \`name\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`provinces\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`provinces\` CHANGE \`id\` \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`province_id\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`province_id\` bigint UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`name\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`locations\` CHANGE \`id\` \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD \`updated_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`provinces\` ADD \`created_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`updated_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`created_at\` timestamp NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`provinces_code_unique\` ON \`provinces\` (\`code\`)`);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD CONSTRAINT \`locations_province_id_foreign\` FOREIGN KEY (\`province_id\`) REFERENCES \`provinces\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

}
