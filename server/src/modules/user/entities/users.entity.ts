import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm'

import { Note } from '../../note/entities/notes.entities'

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

    @OneToMany(() => Note, (note) => note.author)
    notes?: Note[]

    @OneToMany(() => User, (user) => user.createdBy)
    createdUsers?: User[]

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date
}
