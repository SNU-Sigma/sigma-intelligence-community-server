import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { AuthConstants } from '../auth.constants'
import { JWTPayload } from '../models/JWTPayload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => {
                return req.cookies[AuthConstants.cookieKey]
            },
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        })
    }

    async validate(payload: JWTPayload): Promise<User> {
        return {
            id: payload.id,
            email: payload.email,
            password: 'fake',
        }
    }
}

type User = {
    id: number
    email: string
    password: string
}
