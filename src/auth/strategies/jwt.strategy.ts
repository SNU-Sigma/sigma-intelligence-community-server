import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { AuthService } from '../auth.service'
import { JWTPayload } from '../models/JWTPayload'
import { Config } from '../../config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: (req: Request) => {
                return req.cookies[Config.auth.cookieKey]
            },
            ignoreExpiration: false,
            secretOrKey:
                configService.get<string>('JWT_SECRET') ??
                (() => {
                    throw new Error('JWT_SECRET 환경변수가 빠져있습니다.')
                })(),
        })
    }

    async validate(payload: JWTPayload): Promise<User> {
        const user = await this.authService.findUser(payload.id)
        if (user === null) {
            throw new UnauthorizedException()
        }
        return user
    }
}
