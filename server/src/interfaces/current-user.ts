import { UserRole } from 'src/modules/user/entities/users.entity'

export interface CurrentUser {
    userId: string
    role: UserRole
}
