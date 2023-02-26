import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { UserStatisticDto } from 'src/common/dto/user.dto'

@Injectable()
export class AdministratorService {
    constructor(private prisma: PrismaService) {}

    async getStatistics(): Promise<Array<UserStatisticDto>> {
        const userStatistics = (
            await this.prisma.user.findMany({
                include: {
                    profile: true,
                    _count: {
                        select: {
                            reservations: true,
                            posts: true,
                        },
                    },
                },
            })
        ).map((userStat) => {
            return {
                id: userStat.id,
                email: userStat.email,
                role: userStat.role,
                userAuthId: userStat.userAuthId,
                profileId: userStat.profileId,
                profile: userStat.profile,
                reservationCount: userStat._count.reservations,
                postCount: userStat._count.posts,
            }
        })

        return userStatistics
    }
}
