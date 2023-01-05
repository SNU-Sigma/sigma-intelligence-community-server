import {
    Controller,
    Post,
    UseGuards,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { AuthConstants } from './auth.constants'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        if (request.user === undefined) {
            throw new UnauthorizedException()
        }
        const { accessToken } = await this.authService.login(
            request.user as any,
        )
        response.cookie(AuthConstants.cookieKey, accessToken, {
            httpOnly: true,
            maxAge: AuthConstants.accessTokenExpiresIn,
        })
    }
}
