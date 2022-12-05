import {
    Controller,
    Get,
    Param,
    Delete,
    NotFoundException,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiTags } from '@nestjs/swagger'
import { UserDto } from './dto/user.dto'

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    //   @Post()
    //   create(@Body() createUserDto: CreateUserDto) {
    //     return this.usersService.create(createUserDto);
    //   }

    @Get()
    async findAll(): Promise<Array<UserDto>> {
        const users = await this.usersService.findAll()
        return users.map(UserDto.fromEntity)
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserDto> {
        const user = await this.usersService.findOne(+id)
        if (user === null) {
            throw new NotFoundException('존재하지 않는 유저입니다.')
        }
        return UserDto.fromEntity(user)
    }

    //   @Patch(':id')
    //   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.usersService.update(+id, updateUserDto);
    //   }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<UserDto> {
        const user = await this.usersService.remove(+id)
        return UserDto.fromEntity(user)
    }
}
