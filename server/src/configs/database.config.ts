import * as dotenv from 'dotenv'
import { DataSourceOptions } from 'typeorm'

dotenv.config()

export const databaseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    ssl:
        process.env.POSTGRES_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false,
}
