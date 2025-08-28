import { SetMetadata } from '@nestjs/common'

export const Roles = (...roles: Array<'root_admin' | 'admin' | 'user'>) =>
    SetMetadata('roles', roles)
