import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        return { id: 0, email, password }
    }

    async login(user: User) {
        return { accessToken: this.jwtService.sign({ email: user.email }) }
    }
}

type User = {
    id: number
    email: string
    password: string
}
