import { Injectable } from '@nestjs/common'
import { UserProfile } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { UserProfileDto } from './dto/profile.dto'

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) {}

    async updateProfile(
        Userid: number,
        userProfileDto: UserProfileDto,
    ): Promise<UserProfile> {
        const profile = await this.prisma.user.findUnique({
            where: { id: Userid },
            include: {
                profile: true,
            },
        })
        if (profile !== null) {
            profile.profile = userProfileDto
            return profile.profile
        } else {
            return userProfileDto
        }
    }
}
