import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
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

    @ManyToOne(() => User, (user) => user.createdUsers, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'createdById' })
    createdBy?: User

    @Column({ nullable: true })
    createdById?: string

    @OneToMany(() => User, (user) => user.createdBy)
    createdUsers?: User[]

    @CreateDateColumn()
    createdAt: Date
}
