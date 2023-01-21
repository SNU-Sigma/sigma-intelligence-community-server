import { Body, Controller, Post } from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateReservationDto } from './dto/create-resercation.dto'
import { PrinterReservationService } from './printer-reservation.service'
import { ExtractUser } from 'src/utility/decorators/extract-user.decorator'
import { ApiTags } from '@nestjs/swagger'
import { PrinterReservationDto } from './dto/printer-reservation.dto'

@Controller('printer-reservation')
@ApiTags('printer-reservation')
export class PrinterReservationController {
    constructor(private printerReservationService: PrinterReservationService) {}

    @Post('/create')
    takeReservation(
        @Body() reservationInformation: CreateReservationDto,
        @ExtractUser() user: User,
    ): Promise<PrinterReservationDto> {
        return this.printerReservationService.takeReservation(
            reservationInformation,
            user,
        )
    }
}
