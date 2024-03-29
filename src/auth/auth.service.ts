import { MailerService } from '@nestjs-modules/mailer'
import { ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'nestjs-prisma'
import { ConfigService } from '../config/config.service'
import { LoginCredentialsDto } from './dto/login-credentials.dto'
import { JWTPayload } from './models/JWTPayload'
import { MagicLinkPayload } from './models/MagicLinkPayload'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private mailerService: MailerService,
        private configService: ConfigService,
    ) {}

    private logger = new Logger(AuthService.name)

    private findMemberByEmail(email: string) {
        return this.configService
            .select(({ auth }) => auth.memberList)
            .find((member) => member.email === email)
    }

    async createMagicLink(email: string): Promise<void> {
        const member = this.findMemberByEmail(email)
        if (member === undefined) {
            this.logger.log(
                `등록되지 않은 이메일: [ ${email} ] 접속 시도했습니다.`,
            )
            // FIXME: 전시회 위해 임시로 아무 이메일이나 허용 / 추후 주석 제거 필요
            // throw new ForbiddenException('등록되지 않은 이메일입니다.')
        }
        const payload: MagicLinkPayload = { email }
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '30m',
        })
        const link = `${this.configService.select(
            ({ redirect }) => redirect.webBaseUrl,
        )}/set-password?token=${token}&email=${email}`
        await this.mailerService.sendMail({
            to: email,
            subject: '[시그마 인텔리전스] 비밀번호 설정 요청',
            template: 'password',
            context: {
                link,
            },
        })
    }

    async upsertPassword(token: string, password: string): Promise<User> {
        try {
            const { email } =
                await this.jwtService.verifyAsync<MagicLinkPayload>(token)

            // FIXME: 전시회 위해 임시로 아무 이메일이나 허용 / 추후 ?? 뒷부분 제거 필요
            const member = this.findMemberByEmail(email) ?? {
                name: '홈커밍',
                email,
            }
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
                    userAuth: {
                        create: {
                            hashedPassword,
                        },
                    },
                    profile: {
                        create: {
                            name: member.name,
                        },
                    },
                },
                update: {
                    userAuth: {
                        update: {
                            hashedPassword,
                        },
                    },
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
            include: {
                userAuth: {
                    select: {
                        hashedPassword: true,
                    },
                },
            },
        })
        if (user === null) {
            return
        }

        const match = await bcrypt.compare(
            password,
            user.userAuth.hashedPassword,
        )

        if (match === false) {
            return
        }
        return user
    }

    async login(user: User) {
        const payload: JWTPayload = {
            id: user.id,
            email: user.email,
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
