import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    async validateUser(email: string, password: string): Promise<User> {
        return { id: 0, email, password }
    }
}

type User = {
    id: number
    email: string
    password: string
}
