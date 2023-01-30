import { Role, User } from '@prisma/client'
import { UserProfileDto } from './user-profile.dto'

export class UserDto implements User {
    id: number
    email: string
    role: Role
    userAuthId: number
    profileId: number

    profile: UserProfileDto
}
