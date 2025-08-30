import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
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

    @Column()
    name: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    createdBy?: User

    @CreateDateColumn()
    createdAt: Date
}
