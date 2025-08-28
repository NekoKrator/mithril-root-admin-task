import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm'

export enum UserRole {
    ROOT_ADMIN = 'root_admin',
    ADMIN = 'admin',
    USER = 'user',
}

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ nullable: true })
    name: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: string

    @CreateDateColumn()
    createdAt: Date
}
