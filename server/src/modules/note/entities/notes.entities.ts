import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { User } from 'src/modules/user/entities/users.entity'

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

    @CreateDateColumn()
    createdAt: Date
}
