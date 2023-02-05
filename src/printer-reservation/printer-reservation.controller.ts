import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { PrinterReservationService } from './printer-reservation.service'
import { ExtractUser } from 'src/utility/decorators/extract-user.decorator'
import { ApiTags } from '@nestjs/swagger'
import { PrinterReservationWithUserDto } from '../common/dto/printer-reservation.dto'
import { ParseDatePipe } from '../utility/pipe/parse-date.pipe'

@Controller('printer-reservation')
@ApiTags('printer-reservation')
export class PrinterReservationController {
    constructor(private printerReservationService: PrinterReservationService) {}

    @Post('/create')
    takeReservation(
        @Body() reservationInformation: CreateReservationDto,
        @ExtractUser() user: User,
    ): Promise<PrinterReservationWithUserDto> {
        return this.printerReservationService.takeReservation(
            reservationInformation,
            user,
        )
    }

    @Get('/reservations/:printerId')
    getReservationsByPrinterId(
        @Param('printerId', ParseIntPipe) printerId: number,
        @Query('date', ParseDatePipe) date: Date,
    ): Promise<Array<PrinterReservationWithUserDto>> {
        return this.printerReservationService.getReservationsByPrinterId(
            printerId,
            date,
        )
    }

    @Delete('/reservations/:reservationId')
    deleteReservationById(
        @Param('reservationId', ParseIntPipe) reservationId: number,
    ): Promise<PrinterReservationWithUserDto> {
        return this.printerReservationService.deleteReservationById(
            reservationId,
        )
    }
}
