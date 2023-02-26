import { Body, Controller, Get, Patch } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { UserDto } from '../common/dto/user.dto'
import { ExtractUser } from '../utility/decorators/extract-user.decorator'
import { UpdateUserProfileDto } from './dto/update-user-profile.dto'
import { UsersService } from './users.service'

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/my')
    getMyUserData(@ExtractUser() user: User): Promise<UserDto> {
        return this.usersService.getMyUserData(user)
    }

    @Patch('/my')
    editMyProfile(
        @ExtractUser() user: User,
        @Body() updateDto: UpdateUserProfileDto,
    ): Promise<UserDto> {
        return this.usersService.editMyProfile(user, updateDto)
    }
}
