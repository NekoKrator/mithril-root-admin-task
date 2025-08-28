import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'

config()

const configService = new ConfigService()

export default new DataSource({
    type: 'postgres',
    url: configService.get<string>('DB_URL'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*.js'],
})
