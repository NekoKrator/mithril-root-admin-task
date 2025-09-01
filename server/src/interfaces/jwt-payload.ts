export interface JwtPayload {
    sub: string
    email: string
    name: string
    role: 'root_admin' | 'admin' | 'user'
}
