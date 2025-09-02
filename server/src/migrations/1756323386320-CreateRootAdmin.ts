import { MigrationInterface, QueryRunner } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

export class CreateRootAdmin1693123456789 implements MigrationInterface {
    name = 'CreateRootAdmin1693123456789'
    public async up(queryRunner: QueryRunner): Promise<void> {
        const email = process.env.ROOT_EMAIL
        const password = process.env.ROOT_PASSWORD
        const hashedPassword = await bcrypt.hash(password!, 10)

        console.log('before function')

        await queryRunner.query(
            `INSERT INTO "users" ("email", "password", "name", "role", "createdAt")
             VALUES ($1, $2, $3, $4, NOW())`,
            [email, hashedPassword, 'Root Admin', 'root_admin']
        )

        console.log('after')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const email = process.env.ROOT_EMAIL
        await queryRunner.query(`DELETE FROM "users" WHERE email = $1`, [email])
    }
}
