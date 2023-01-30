import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { addDays, addHours } from 'date-fns'
import { PrismaService } from 'nestjs-prisma'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { PrinterReservationDto } from './dto/printer-reservation.dto'

@Injectable()
export class PrinterReservationService {
    constructor(private readonly prisma: PrismaService) {}

    async takeReservation(
        reservationInformation: CreateReservationDto,
        user: User,
    ): Promise<PrinterReservationDto> {
        const printerId = reservationInformation.printerId
        const startTime = reservationInformation.startDateTime
        const endTime = addHours(
            new Date(reservationInformation.startDateTime),
            reservationInformation.usageTime,
        )
        const reason = reservationInformation.reason

        // checks if there is a printer reservation with overlapping time
        const reservationCheck = await this.prisma.printerReservation.findFirst(
            {
                where: {
                    AND: { printerId },
                    OR: [
                        {
                            requestStartTime: {
                                gte: startTime,
                                lte: endTime,
                            },
                        },
                        {
                            requestEndTime: {
                                gte: startTime,
                                lte: endTime,
                            },
                        },
                        {
                            requestStartTime: {
                                lte: startTime,
                            },
                            requestEndTime: {
                                gte: endTime,
                            },
                        },
                    ],
                },
                include: printerReservationIncludeArgs,
            },
        )

        if (reservationCheck) {
            throw new BadRequestException(
                `Printer ${reservationCheck.printerId} has reservation from ${reservationCheck.requestStartTime} to ${reservationCheck.requestEndTime}`,
            )
        }

        const reservation = await this.prisma.printerReservation.create({
            data: {
                printerId: printerId,
                requestStartTime: startTime,
                requestEndTime: endTime,
                reason: reason,
                userId: user.id,
            },
            include: printerReservationIncludeArgs,
        })

        return reservation
    }

    async getReservationsByPrinterId(
        printerId: number,
        date: Date,
    ): Promise<Array<PrinterReservationDto>> {
        const reservations = await this.prisma.printerReservation.findMany({
            where: {
                printerId,
                requestStartTime: {
                    gte: date,
                    lte: addDays(date, 1),
                },
            },
            orderBy: {
                requestStartTime: 'asc',
            },
            include: printerReservationIncludeArgs,
        })

        return reservations
    }

    async deleteReservationById(
        reservationId: number,
    ): Promise<PrinterReservationDto> {
        const reservationToDelete = await this.prisma.printerReservation.delete(
            {
                where: {
                    id: reservationId,
                },
                include: printerReservationIncludeArgs,
            },
        )

        return reservationToDelete
    }
}

const printerReservationIncludeArgs = {
    user: {
        include: { profile: true },
    },
}
