import { UserProfile } from '@prisma/client'

export class UserProfileDto implements UserProfile {
    id: number
    name: string
    freshmanYear: number | null
    major: string | null
    profileImageUrl: string | null
}
