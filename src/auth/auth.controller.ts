import { Controller, Post, Res, Body, ForbiddenException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { AuthConstants } from './auth.constants'
import { LoginCredentialsDto } from './dto/login-credentials.dto'
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto'
import { SetPasswordCredentialsDto } from './dto/set-password-credentials.dto'

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
            throw new ForbiddenException(
                '이메일 혹은 비밀번호가 잘못되었습니다.',
            )
        }
        const { accessToken } = await this.authService.login(user)
        response.cookie(AuthConstants.cookieKey, accessToken, {
            httpOnly: true,
            maxAge: AuthConstants.accessTokenExpiresIn,
        })
    }

    @Post('sign-up')
    async signUp(@Body() { email }: SignUpCredentialsDto): Promise<string> {
        return this.authService.createMagicLink(email)
    }

    @Post('set-password')
    async setPassword(
        @Body() { password, token }: SetPasswordCredentialsDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        const user = await this.authService.upsertPassword(token, password)
        const { accessToken } = await this.authService.login(user)
        response.cookie(AuthConstants.cookieKey, accessToken, {
            httpOnly: true,
            maxAge: AuthConstants.accessTokenExpiresIn,
        })
    }
}
