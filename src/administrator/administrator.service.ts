import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { UserWithReservationsDto } from 'src/common/dto/user.dto'

@Injectable()
export class AdministratorService {
    constructor(private prisma: PrismaService) {}

    async getStatistics(): Promise<Array<UserWithReservationsDto>> {
        const UserStatistics = this.prisma.user.findMany({
            include: {
                profile: true,
                reservations: true,
            },
        })

        return UserStatistics
    }
}
