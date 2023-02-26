import { ApiProperty } from '@nestjs/swagger'
import { Role, User } from '@prisma/client'
import { UserProfileDto } from './user-profile.dto'

export class UserDto implements User {
    id: number
    email: string
    @ApiProperty({ enum: Role })
    role: Role
    userAuthId: number
    profileId: number

    profile: UserProfileDto
}

export class UserStatisticDto extends UserDto {
    reservationCount: number
}
