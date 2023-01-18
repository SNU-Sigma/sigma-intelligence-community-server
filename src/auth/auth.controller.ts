import { Body, Controller, ForbiddenException, Post, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { LoginCredentialsDto } from './dto/login-credentials.dto'
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto'
import { SetPasswordCredentialsDto } from './dto/set-password-credentials.dto'
import { Public } from '../utility/decorators/public.decorator'
import { Config } from '../config'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
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
        response.cookie(Config.auth.cookieKey, accessToken, {
            httpOnly: true,
            maxAge: Config.auth.accessTokenExpiresIn,
            sameSite: 'none',
            secure: true,
        })
    }

    @Public()
    @Post('sign-up')
    async signUp(@Body() { email }: SignUpCredentialsDto): Promise<void> {
        return this.authService.createMagicLink(email)
    }

    @Public()
    @Post('set-password')
    async setPassword(
        @Body() { password, token }: SetPasswordCredentialsDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        const user = await this.authService.upsertPassword(token, password)
        const { accessToken } = await this.authService.login(user)
        response.cookie(Config.auth.cookieKey, accessToken, {
            httpOnly: true,
            maxAge: Config.auth.accessTokenExpiresIn,
            sameSite: 'none',
            secure: true,
        })
    }
}
