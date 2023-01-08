import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { Public } from './utility/decorators/public.decorator'
import { ExtractUser } from './utility/decorators/extract-user.decorator'
import { User } from '@prisma/client'

@Controller()
@ApiTags('root')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public()
    @Get('health')
    getHello(): string {
        return this.appService.getHello()
    }

    @Get('__for_testing_extract_user')
    getUserEmail(@ExtractUser() user: User): string {
        return user.email
    }
}
