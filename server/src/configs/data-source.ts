import 'dotenv/config'
import { DataSource } from 'typeorm'
import { databaseConfig } from './database.config'

export default new DataSource({
    ...databaseConfig,
    synchronize: false,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
})
