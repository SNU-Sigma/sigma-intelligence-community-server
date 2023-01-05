import {
    Controller,
    Post,
    Res,
    UnauthorizedException,
    Body,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { AuthConstants } from './auth.constants'
import { LoginCredentialsDto } from './dto/login-credentials.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Body() loginCredentialsDto: LoginCredentialsDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        const user = await this.authService.validateUser(loginCredentialsDto)
        if (user === undefined) {
            throw new UnauthorizedException(
                '이메일 혹은 비밀번호가 잘못되었습니다.',
            )
        }
        const { accessToken } = await this.authService.login(user)
        response.cookie(AuthConstants.cookieKey, accessToken, {
            httpOnly: true,
            maxAge: AuthConstants.accessTokenExpiresIn,
        })
    }
}
