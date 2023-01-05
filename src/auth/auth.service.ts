import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JWTPayload } from './models/JWTPayload'
import { PrismaService } from 'nestjs-prisma'
import { User } from '@prisma/client'
import { LoginCredentialsDto } from './dto/login-credentials.dto'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

    async validateUser({
        email,
        password,
    }: LoginCredentialsDto): Promise<User | undefined> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        })
        if (user === null) {
            return
        }

        const match = await bcrypt.compare(password, user.hashedPassword)

        if (match === false) {
            return
        }
        return user
    }

    async login(user: User) {
        const payload: JWTPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
        }

        return {
            accessToken: this.jwtService.sign(payload),
        }
    }

    async findUser(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        })
    }
}
