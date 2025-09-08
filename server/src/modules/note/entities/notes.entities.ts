import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm'
import { User } from '../../user/entities/users.entity'
import { Visit } from '../../visit/entities/visit.entity'

@Entity({ name: 'notes' })
export class Note {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column('text')
    content: string

    @Column({ type: 'timestamp', nullable: true })
    reminderDate: Date | null

    @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author: User

    @Column()
    authorId: string

    @OneToMany(() => Visit, (visit) => visit.note)
    viewedPage: Visit[]

    @Column({ default: false })
    isSent: boolean

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date
}
