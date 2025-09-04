import * as dotenv from 'dotenv'
import { Note } from 'src/modules/note/entities/notes.entities'
import { User } from 'src/modules/user/entities/users.entity'
import { DataSourceOptions } from 'typeorm'

dotenv.config()

export const databaseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [User, Note],
    ssl:
        process.env.POSTGRES_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false,
}
