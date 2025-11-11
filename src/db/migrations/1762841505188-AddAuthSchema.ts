import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthSchema1762841505188 implements MigrationInterface {
    name = 'AddAuthSchema1762841505188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`avatar_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bytes\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`access_token\` varchar(255) NULL, \`refresh_token\` varchar(255) NULL, \`id_token\` varchar(255) NULL, \`access_token_expires_at\` datetime NULL, \`refresh_token_expires_at\` datetime NULL, \`scope\` varchar(255) NULL, \`password\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`account_id\` varchar(255) NOT NULL, \`provider_id\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`email_verified\` tinyint NOT NULL DEFAULT 0, \`image\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`stripe_customer_id\` varchar(255) NULL, \`ban_expires\` varchar(255) NULL, \`ban_reason\` text NULL, \`banned\` tinyint NOT NULL DEFAULT 0, \`role\` text NULL, \`terms_agreed\` tinyint NOT NULL DEFAULT 0, \`avatar_image_id\` int NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`REL_013c0803e80018bfe46fca1a98\` (\`avatar_image_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`expires_at\` datetime NOT NULL, \`token\` varchar(255) NOT NULL, \`ip_address\` varchar(255) NULL, \`user_agent\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`impersonated_by\` text NULL, \`user_id\` int NOT NULL, UNIQUE INDEX \`IDX_232f8e85d7633bd6ddfad42169\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subscription\` (\`id\` int NOT NULL AUTO_INCREMENT, \`plan\` varchar(255) NOT NULL, \`reference_id\` varchar(255) NOT NULL, \`stripe_customer_id\` varchar(255) NULL, \`stripe_subscription_id\` varchar(255) NULL, \`status\` varchar(255) NOT NULL, \`period_start\` bigint NULL, \`period_end\` bigint NULL, \`cancel_at_period_end\` tinyint NULL, \`seats\` bigint NULL, \`trial_start\` datetime NULL, \`trial_end\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verification_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD CONSTRAINT \`FK_efef1e5fdbe318a379c06678c51\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_013c0803e80018bfe46fca1a985\` FOREIGN KEY (\`avatar_image_id\`) REFERENCES \`avatar_image\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_30e98e8746699fb9af235410aff\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_30e98e8746699fb9af235410aff\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_013c0803e80018bfe46fca1a985\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_efef1e5fdbe318a379c06678c51\``);
        await queryRunner.query(`DROP TABLE \`verification_token\``);
        await queryRunner.query(`DROP TABLE \`subscription\``);
        await queryRunner.query(`DROP INDEX \`IDX_232f8e85d7633bd6ddfad42169\` ON \`session\``);
        await queryRunner.query(`DROP TABLE \`session\``);
        await queryRunner.query(`DROP INDEX \`REL_013c0803e80018bfe46fca1a98\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`account\``);
        await queryRunner.query(`DROP TABLE \`avatar_image\``);
    }

}
