import { Module } from '@nestjs/common'
import { PrinterReservationController } from './printer-reservation.controller'
import { PrinterReservationService } from './printer-reservation.service'

@Module({
    controllers: [PrinterReservationController],
    providers: [PrinterReservationService],
})
export class PrinterReservationModule {}
