import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm'
import { User } from '../../user/entities/users.entity'
import { Note } from '../../note/entities/notes.entities'

@Entity({ name: 'visits' })
export class Visit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Note, (note) => note.viewedPage, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'noteId' })
    note: Note

    @Column()
    noteId: string

    @ManyToOne(() => User, (user) => user.visitedPage, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'visitorId' })
    visitor: User

    @Column()
    visitorId: string

    @Column({ default: false })
    isSent: boolean

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date
}
