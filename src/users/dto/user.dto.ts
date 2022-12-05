import { User } from '@prisma/client'
import { plainToClass } from 'class-transformer'

export class UserDto {
    id: number
    email: string
    name: string

    static fromEntity = ({ id, email, name }: User): UserDto => {
        return plainToClass<UserDto, UserDto>(UserDto, {
            id,
            email,
            name,
        })
    }
}
