import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { AuthConstants } from '../auth.constants'
import { AuthService } from '../auth.service'
import { JWTPayload } from '../models/JWTPayload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: (req: Request) => {
                return req.cookies[AuthConstants.cookieKey]
            },
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
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
