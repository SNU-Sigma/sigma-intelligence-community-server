import { UserProfile } from '@prisma/client'

export class UserProfileDto implements UserProfile {
    id: number
    name: string
    freshmanYear: number
    major: string
    profileImageUrl: string

    static fromUserProfile({
        freshmanYear,
        major,
        profileImageUrl,
        ...rest
    }: UserProfile): UserProfileDto {
        return {
            ...rest,
            freshmanYear: freshmanYear ?? 0,
            profileImageUrl: profileImageUrl ?? '',
            major: major ?? '',
        }
    }
}
