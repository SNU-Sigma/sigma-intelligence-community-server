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
import { ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { ExtractUser } from 'src/utility/decorators/extract-user.decorator'
import {
    ListedPrinterReservationDto,
    PrinterReservationDto,
} from '../common/dto/printer-reservation.dto'
import { ParseDatePipe } from '../utility/pipe/parse-date.pipe'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { PrinterReservationService } from './printer-reservation.service'

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

    @Get('/reservations/:printerId')
    getReservationsByPrinterId(
        @ExtractUser() user: User,
        @Param('printerId', ParseIntPipe) printerId: number,
        @Query('date', ParseDatePipe) date: Date,
    ): Promise<Array<ListedPrinterReservationDto>> {
        return this.printerReservationService.getReservationsByPrinterId(
            user,
            printerId,
            date,
        )
    }

    @Delete('/reservations/:reservationId')
    async deleteReservationById(
        @Param('reservationId', ParseIntPipe) reservationId: number,
        @ExtractUser() user: User,
    ): Promise<void> {
        await this.printerReservationService.deleteReservationById(
            reservationId,
            user.id,
        )
    }

    @Get('/my-reservations')
    getMyReservations(
        @ExtractUser() user: User,
    ): Promise<Array<PrinterReservationDto>> {
        return this.printerReservationService.getMyReservations(user.id)
    }
}
