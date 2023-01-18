import { Body, Controller, Post } from '@nestjs/common'
import { PrinterReservation, User } from '@prisma/client'
import { ReservationInformation } from './dto/reservation-info.dto'
import { PrinterReservationService } from './printer-reservation.service'
import { ExtractUser } from 'src/utility/decorators/extract-user.decorator'
import { ApiTags } from '@nestjs/swagger'

@Controller('printer-reservation')
@ApiTags('printer-reservation')
export class PrinterReservationController {
    constructor(private printerReservationService: PrinterReservationService) {}

    @Post()
    takeReservation(
        @Body() reservationInformation: ReservationInformation,
        @ExtractUser() user: User,
    ): Promise<PrinterReservation> {
        return this.printerReservationService.takeReservation(
            reservationInformation,
            user,
        )
    }
}
