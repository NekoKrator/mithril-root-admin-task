import { MigrationInterface, QueryRunner } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

export class CreateUsersAndRootAdmin1756590943027
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const email = process.env.ROOT_EMAIL
        const password = process.env.ROOT_PASSWORD
        const hashedPassword = await bcrypt.hash(password!, 10)

        await queryRunner.query(
            `INSERT INTO "users" ("email", "password", "name", "role", "createdAt")
             VALUES ($1, $2, $3, $4, NOW())`,
            [email, hashedPassword, 'Root Admin', 'root_admin']
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const email = process.env.ROOT_EMAIL
        await queryRunner.query(`DELETE FROM "users" WHERE email = $1`, [email])
    }
}
