import { Controller, ForbiddenException, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Role, User } from '@prisma/client'
import { UserStatisticDto } from 'src/common/dto/user.dto'
import { ExtractUser } from 'src/utility/decorators/extract-user.decorator'
import { AdministratorService } from './administrator.service'

@Controller('administrator')
@ApiTags('administrator')
export class AdministratorController {
    constructor(private administratorService: AdministratorService) {}

    @Get('/statistics')
    getStatistics(@ExtractUser() user: User): Promise<Array<UserStatisticDto>> {
        if (user.role === Role.COMMON) {
            throw new ForbiddenException()
        }
        return this.administratorService.getStatistics()
    }
}
