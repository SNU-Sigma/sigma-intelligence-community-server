import { PrinterReservation } from '@prisma/client'
import { UserDto } from 'src/common/dto/user.dto'

export class PrinterReservationDto implements PrinterReservation {
    id: number
    printerId: number
    requestStartTime: Date
    requestEndTime: Date
    reason: string
    userId: number
    user: UserDto
}

export class ListedPrinterReservationDto extends PrinterReservationDto {
    isMine: boolean
}
