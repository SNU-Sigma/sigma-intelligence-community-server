import { User, UserAuth } from '@prisma/client'
import { UserProfileDto } from './user-profile.dto'

export class UserDto implements User {
    id: number
    email: string
    userAuthId: number
    profileId: number

    userAuth?: UserAuth
    profile?: UserProfileDto
}
