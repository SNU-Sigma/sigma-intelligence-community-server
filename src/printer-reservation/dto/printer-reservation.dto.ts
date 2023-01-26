import { PrinterReservation } from '@prisma/client'
import { UserDto } from './user.dto'

export class PrinterReservationDto implements PrinterReservation {
    id: number
    printerId: number
    requestStartTime: Date
    requestEndTime: Date
    reason: string
    userId: number
    User?: UserDto
}
