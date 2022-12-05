import {
    Controller,
    Get,
    Param,
    Delete,
    NotFoundException,
    Patch,
    Post,
    Body,
    ParseIntPipe,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiTags } from '@nestjs/swagger'
import { UserDto } from './dto/user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return this.usersService.create(createUserDto)
    }

    @Get()
    async findAll(): Promise<Array<UserDto>> {
        const users = await this.usersService.findAll()
        return users.map(UserDto.fromEntity)
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
        const user = await this.usersService.findOne(id)
        if (user === null) {
            throw new NotFoundException('존재하지 않는 유저입니다.')
        }
        return UserDto.fromEntity(user)
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserDto> {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
        const user = await this.usersService.remove(id)
        return UserDto.fromEntity(user)
    }
}
