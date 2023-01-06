import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JWTPayload } from './models/JWTPayload'
import { PrismaService } from 'nestjs-prisma'
import { User } from '@prisma/client'
import { LoginCredentialsDto } from './dto/login-credentials.dto'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { AuthConstants } from './auth.constants'
import { MagicLinkPayload } from './models/MagicLinkPayload'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {}

    private findMemberByEmail(email: string) {
        return AuthConstants.memberList.find((member) => member.email === email)
    }

    async createMagicLink(email: string): Promise<string> {
        const member = this.findMemberByEmail(email)
        if (member === undefined) {
            throw new ForbiddenException('등록되지 않은 이메일입니다.')
        }
        const payload: MagicLinkPayload = { email }
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '30m',
        })
        return `${AuthConstants.magicLinkBaseUrl}/set-password?token=${token}&email=${email}`
    }

    async upsertPassword(token: string, password: string): Promise<User> {
        try {
            const { email } =
                await this.jwtService.verifyAsync<MagicLinkPayload>(token)

            const member = this.findMemberByEmail(email)
            if (member === undefined) {
                throw new Error()
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            return this.prisma.user.upsert({
                where: {
                    email,
                },
                create: {
                    email,
                    hashedPassword,
                    name: member.name,
                },
                update: {
                    hashedPassword,
                },
            })
        } catch (e) {
            throw new ForbiddenException('유효하지 않은 토큰')
        }
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
