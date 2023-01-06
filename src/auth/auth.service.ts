import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JWTPayload } from './models/JWTPayload'
import { PrismaService } from 'nestjs-prisma'
import { User } from '@prisma/client'
import { LoginCredentialsDto } from './dto/login-credentials.dto'
import bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { AuthConstants } from './auth.constants'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {}

    private temporaryToken: { [key in string]: string } = {}

    private cleanUpExpiredTokens() {
        Object.entries(this.temporaryToken).forEach(([email, token]) => {
            try {
                this.jwtService.verify(token)
            } catch (e) {
                delete this.temporaryToken[email]
            }
        })
    }

    async createMagicLink(email: string): Promise<string> {
        this.cleanUpExpiredTokens()
        const token = await this.jwtService.sign(
            { email },
            {
                expiresIn: '30m',
            },
        )
        this.temporaryToken[email] = token
        return `${AuthConstants.magicLinkBaseUrl}/set-password?token=${token}&email=${email}`
    }

    async upsertPassword(token: string, password: string): Promise<User> {
        this.cleanUpExpiredTokens()
        const email = Object.entries(this.temporaryToken).find(
            ([, tokenForEmail]) => tokenForEmail === token,
        )?.[1]
        if (email === undefined) {
            throw new UnauthorizedException('토큰 만료')
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        return this.prisma.user.upsert({
            where: {
                email,
            },
            create: {
                email,
                hashedPassword,
                name: '테스트 이름', // TODO: 저장된 값에서 찾기
            },
            update: {
                hashedPassword,
            },
        })
    }

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
