import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { UserProfileDto } from '../common/dto/user-profile.dto'
import { UserDto } from '../common/dto/user.dto'
import { UpdateUserProfileDto } from './dto/update-user-profile.dto'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getMyUserData(user: User): Promise<UserDto> {
        const profile = await this.prisma.userProfile.findUnique({
            where: { id: user.profileId },
        })
        if (profile === null) {
            // profile은 항상 존재해야 하기 때문에 아래 코드가 실행 안 되어야 맞음
            throw new InternalServerErrorException('profile is null')
        }
        return {
            ...user,
            profile: UserProfileDto.fromUserProfile(profile),
        }
    }

    async editMyProfile(
        user: User,
        { freshmanYear, profileImageUrl, major }: UpdateUserProfileDto,
    ): Promise<UserDto> {
        return this.prisma.user
            .update({
                where: { id: user.id },
                data: {
                    profile: {
                        update: {
                            freshmanYear,
                            profileImageUrl,
                            major,
                        },
                    },
                },
                include: { profile: true },
            })
            .then(UserDto.fromUserIncludeProfile)
    }
}
