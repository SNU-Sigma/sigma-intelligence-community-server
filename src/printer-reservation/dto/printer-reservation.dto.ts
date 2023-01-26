import { PrinterReservation } from '@prisma/client'

export class PrinterReservationDto implements PrinterReservation {
    reservationId: number
    printerId: number
    requestStartTime: Date
    requestEndTime: Date
    reason: string
    userId: number
}
