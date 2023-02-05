import { Role, User } from '@prisma/client'
import { PrinterReservationWithoutUserDto } from './printer-reservation.dto'
import { UserProfileDto } from './user-profile.dto'

export class UserWithoutReservationsDto implements User {
    id: number
    email: string
    role: Role
    userAuthId: number
    profileId: number

    profile: UserProfileDto
}

export class UserWithReservationsDto implements User {
    id: number
    email: string
    role: Role
    userAuthId: number
    profileId: number

    profile: UserProfileDto
    reservations: Array<PrinterReservationWithoutUserDto>
}
