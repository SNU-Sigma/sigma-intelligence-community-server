import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { addDays, addHours } from 'date-fns'
import { PrismaService } from 'nestjs-prisma'
import {
    ListedPrinterReservationDto,
    PrinterReservationDto,
} from '../common/dto/printer-reservation.dto'
import { CreateReservationDto } from './dto/create-reservation.dto'

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
                                lt: endTime,
                            },
                        },
                        {
                            requestEndTime: {
                                gt: startTime,
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
        user: User,
        printerId: number,
        date: Date,
    ): Promise<Array<ListedPrinterReservationDto>> {
        const reservations = await this.prisma.printerReservation.findMany({
            where: {
                AND: { printerId },
                OR: [
                    {
                        requestStartTime: {
                            gte: date,
                            lt: addDays(date, 1),
                        },
                    },
                    {
                        requestEndTime: {
                            gt: date,
                            lte: addDays(date, 1),
                        },
                    },
                ],
            },
            orderBy: {
                requestStartTime: 'asc',
            },
            include: printerReservationIncludeArgs,
        })

        return reservations.map((reservation) => {
            return {
                ...reservation,
                isMine: user.id === reservation.userId,
            }
        })
    }

    private async checkOwnershipOfReservation(
        reservationId: number,
        userId: User['id'],
    ) {
        const reservation = await this.prisma.printerReservation.findUnique({
            where: { id: reservationId },
        })
        if (reservation?.userId !== userId) {
            throw new ForbiddenException('Unauthorized User')
        }
    }

    async deleteReservationById(
        reservationId: number,
        userId: User['id'],
    ): Promise<PrinterReservationDto> {
        await this.checkOwnershipOfReservation(reservationId, userId)
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

    async getMyReservations(
        userId: User['id'],
    ): Promise<Array<PrinterReservationDto>> {
        const reservations = await this.prisma.printerReservation.findMany({
            where: { userId },
            include: printerReservationIncludeArgs,
        })
        return reservations
    }
}

const printerReservationIncludeArgs = {
    user: {
        include: { profile: true },
    },
}
