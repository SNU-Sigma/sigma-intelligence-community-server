import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { UserDto } from '../common/dto/user.dto'
import { ExtractUser } from '../utility/decorators/extract-user.decorator'
import { UsersService } from './users.service'

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/my')
    getMyUserData(@ExtractUser() user: User): Promise<UserDto> {
        return this.usersService.getMyUserData(user)
    }
}
