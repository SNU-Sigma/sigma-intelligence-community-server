import { UserProfile } from '@prisma/client'
import { IsNumber, IsString } from 'class-validator'

export class UserProfileDto implements UserProfile {
    @IsNumber()
    id: number
    @IsString()
    name: string
    @IsNumber()
    freshmanYear: number
    @IsString()
    major: string
    @IsString()
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
            profileImageUrl:
                profileImageUrl ??
                'https://storage.sigma-intelligence.com/blank-profile.svg',
            major: major ?? '',
        }
    }
}
