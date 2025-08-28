import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Roles } from '../decorators/roles.decorator'
import { JwtPayload } from '../../src/interfaces/jwt-payload.interface'
import { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<
            Array<'root_admin' | 'admin' | 'user'>
        >(Roles, [context.getHandler(), context.getClass()])

        if (!requiredRoles || requiredRoles.length === 0) {
            return true
        }

        const request = context.switchToHttp().getRequest<Request>()
        const user = request.user as JwtPayload | undefined

        if (!user) {
            throw new ForbiddenException('User not found')
        }

        if (user.role === 'root_admin') {
            return true
        }

        if (requiredRoles.includes(user.role)) {
            return true
        }

        throw new ForbiddenException('You do not have permission')
    }
}
