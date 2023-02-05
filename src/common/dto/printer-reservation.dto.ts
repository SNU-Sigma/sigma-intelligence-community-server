import { PrinterReservation } from '@prisma/client'
import { UserWithoutReservationsDto } from 'src/common/dto/user.dto'

export class PrinterReservationWithUserDto implements PrinterReservation {
    id: number
    printerId: number
    requestStartTime: Date
    requestEndTime: Date
    reason: string
    userId: number
    user: UserWithoutReservationsDto
}

export class PrinterReservationWithoutUserDto implements PrinterReservation {
    id: number
    printerId: number
    requestStartTime: Date
    requestEndTime: Date
    reason: string
    userId: number
}
