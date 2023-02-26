import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { UserIncludeProfile } from '../models/UserIncludeProfile'
import { UserProfileDto } from './user-profile.dto'

export class UserDto implements UserIncludeProfile {
    id: number
    email: string
    @ApiProperty({ enum: Role })
    role: Role
    userAuthId: number
    profileId: number

    profile: UserProfileDto

    static fromUserIncludeProfile({
        profile,
        ...rest
    }: UserIncludeProfile): UserDto {
        return {
            ...rest,
            profile: UserProfileDto.fromUserProfile(profile),
        }
    }
}

export class UserStatisticDto extends UserDto {
    reservationCount: number
    postCount: number
}
