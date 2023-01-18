import { BadRequestException, Injectable } from '@nestjs/common'
import { PrinterReservation, User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { ReservationInformation } from './dto/reservation-info.dto'

@Injectable()
export class PrinterReservationService {
    constructor(private readonly prisma: PrismaService) {}

    async takeReservation(
        reservationInformation: ReservationInformation,
        user: User,
    ): Promise<PrinterReservation> {
        const printerId = reservationInformation.printerId
        const startTime = new Date(reservationInformation.day)
        startTime.setHours(reservationInformation.startTime)
        const endTime = new Date(reservationInformation.day)
        endTime.setHours(
            reservationInformation.startTime + reservationInformation.usageTime,
        )
        const reason = reservationInformation.reason

        // checks if there is a printer reservation with overlapping time
        const reservationCheck = await this.prisma.printerReservation.findFirst(
            {
                where: {
                    OR: [
                        {
                            printerId: printerId,
                            startTime: {
                                gte: startTime,
                                lte: endTime,
                            },
                        },
                        {
                            printerId: printerId,
                            endTime: {
                                gte: startTime,
                                lte: endTime,
                            },
                        },
                        {
                            printerId: printerId,
                            startTime: {
                                lte: startTime,
                            },
                            endTime: {
                                gte: endTime,
                            },
                        },
                    ],
                },
            },
        )

        if (reservationCheck) {
            throw new BadRequestException(
                `Printer ${reservationCheck.printerId} has reservation from ${reservationCheck.startTime} to ${reservationCheck.endTime}`,
            )
        }

        const reservation = await this.prisma.printerReservation.create({
            data: {
                printerId: printerId,
                startTime: startTime,
                endTime: endTime,
                reason: reason,
                userId: user.id,
            },
        })

        return reservation
    }
}
