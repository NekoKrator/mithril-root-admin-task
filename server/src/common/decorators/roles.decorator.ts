import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: Array<'root_admin' | 'admin' | 'user'>) =>
    SetMetadata(ROLES_KEY, roles)
