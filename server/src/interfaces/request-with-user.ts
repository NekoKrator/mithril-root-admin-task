import { Request } from 'express'
import { UserRole } from 'src/modules/user/entities/users.entity'

export interface RequestWithUser extends Request {
    user: {
        userId: string
        role: UserRole
    }
}
