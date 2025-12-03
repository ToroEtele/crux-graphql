import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoreSchema1762929903429 implements MigrationInterface {
  name = 'AddCoreSchema1762929903429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`plan_workout_exercise_override\` (\`id\` int NOT NULL AUTO_INCREMENT, \`plan_workout_id\` int NOT NULL, \`workout_exercise_id\` int NOT NULL, \`field\` varchar(255) NOT NULL, \`new_value\` varchar(255) NOT NULL, \`notes\` text NULL, INDEX \`IDX_defb8238f07a295861095b7216\` (\`workout_exercise_id\`), INDEX \`IDX_eae49434b8644433ceae5e3b86\` (\`plan_workout_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`plan_workout\` (\`id\` int NOT NULL AUTO_INCREMENT, \`week_number\` int NOT NULL, \`day_of_week\` int NOT NULL, \`order_in_day\` int NULL, \`custom_name\` varchar(255) NULL, \`notes\` text NULL, \`workout_id\` int NOT NULL, \`plan_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`workout\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(2048) NOT NULL, \`diff\` varchar(255) NOT NULL, \`is_public\` tinyint NOT NULL DEFAULT 0, \`category_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`workout_exercise_param\` (\`set\` int NOT NULL, \`workout_exercise_id\` int NOT NULL, \`weight\` float NOT NULL, \`rest\` int NOT NULL, \`time\` int NOT NULL, \`reps\` int NOT NULL, PRIMARY KEY (\`set\`, \`workout_exercise_id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`workout_exercise\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order\` int NOT NULL, \`sets\` int NOT NULL, \`reps\` int NOT NULL, \`time\` int NULL, \`weight\` int NULL, \`rest_after\` int NOT NULL, \`rest_between\` int NOT NULL, \`notes\` text NULL, \`exercise_id\` int NOT NULL, \`workout_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`exercise\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(2048) NOT NULL, \`diff\` varchar(255) NOT NULL, \`default_units\` varchar(255) NOT NULL, \`category_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`plan\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(2048) NOT NULL, \`duration_weeks\` int NOT NULL, \`diff\` varchar(255) NOT NULL, \`is_public\` tinyint NOT NULL DEFAULT 0, \`category_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`plan_workout_exercise_override\` ADD CONSTRAINT \`FK_eae49434b8644433ceae5e3b860\` FOREIGN KEY (\`plan_workout_id\`) REFERENCES \`plan_workout\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`plan_workout_exercise_override\` ADD CONSTRAINT \`FK_defb8238f07a295861095b72162\` FOREIGN KEY (\`workout_exercise_id\`) REFERENCES \`workout_exercise\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`plan_workout\` ADD CONSTRAINT \`FK_fa674f69afec2cedb26a5d20f9e\` FOREIGN KEY (\`workout_id\`) REFERENCES \`workout\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`plan_workout\` ADD CONSTRAINT \`FK_614784b0f5598a66d4ab7d16995\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plan\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`workout\` ADD CONSTRAINT \`FK_cae9fbd1831b588ad5f76bcf285\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`workout_exercise_param\` ADD CONSTRAINT \`FK_b0ea003ad39d3bfe78bbd6e97b8\` FOREIGN KEY (\`workout_exercise_id\`) REFERENCES \`workout_exercise\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`workout_exercise\` ADD CONSTRAINT \`FK_8ccd7bc9d29d2ddb137a57ff69c\` FOREIGN KEY (\`exercise_id\`) REFERENCES \`exercise\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`workout_exercise\` ADD CONSTRAINT \`FK_492cbfa1ca305202461669b8021\` FOREIGN KEY (\`workout_id\`) REFERENCES \`workout\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`exercise\` ADD CONSTRAINT \`FK_977a54be5b15644bf5dc22093d5\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`plan\` ADD CONSTRAINT \`FK_4abedc01b0c0c400accca270efa\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`plan\` DROP FOREIGN KEY \`FK_4abedc01b0c0c400accca270efa\``);
    await queryRunner.query(`ALTER TABLE \`exercise\` DROP FOREIGN KEY \`FK_977a54be5b15644bf5dc22093d5\``);
    await queryRunner.query(`ALTER TABLE \`workout_exercise\` DROP FOREIGN KEY \`FK_492cbfa1ca305202461669b8021\``);
    await queryRunner.query(`ALTER TABLE \`workout_exercise\` DROP FOREIGN KEY \`FK_8ccd7bc9d29d2ddb137a57ff69c\``);
    await queryRunner.query(`ALTER TABLE \`workout_exercise_param\` DROP FOREIGN KEY \`FK_b0ea003ad39d3bfe78bbd6e97b8\``);
    await queryRunner.query(`ALTER TABLE \`workout\` DROP FOREIGN KEY \`FK_cae9fbd1831b588ad5f76bcf285\``);
    await queryRunner.query(`ALTER TABLE \`plan_workout\` DROP FOREIGN KEY \`FK_614784b0f5598a66d4ab7d16995\``);
    await queryRunner.query(`ALTER TABLE \`plan_workout\` DROP FOREIGN KEY \`FK_fa674f69afec2cedb26a5d20f9e\``);
    await queryRunner.query(`ALTER TABLE \`plan_workout_exercise_override\` DROP FOREIGN KEY \`FK_defb8238f07a295861095b72162\``);
    await queryRunner.query(`ALTER TABLE \`plan_workout_exercise_override\` DROP FOREIGN KEY \`FK_eae49434b8644433ceae5e3b860\``);
    await queryRunner.query(`DROP TABLE \`plan\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`exercise\``);
    await queryRunner.query(`DROP TABLE \`workout_exercise\``);
    await queryRunner.query(`DROP TABLE \`workout_exercise_param\``);
    await queryRunner.query(`DROP TABLE \`workout\``);
    await queryRunner.query(`DROP TABLE \`plan_workout\``);
    await queryRunner.query(`DROP INDEX \`IDX_eae49434b8644433ceae5e3b86\` ON \`plan_workout_exercise_override\``);
    await queryRunner.query(`DROP INDEX \`IDX_defb8238f07a295861095b7216\` ON \`plan_workout_exercise_override\``);
    await queryRunner.query(`DROP TABLE \`plan_workout_exercise_override\``);
  }
}
