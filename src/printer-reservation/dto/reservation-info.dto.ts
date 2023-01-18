import { IsNumber, IsString, Max, Min } from 'class-validator'

export class ReservationInformation {
    @IsNumber()
    printerId: number

    @IsString()
    day: string

    @IsNumber()
    @Min(0)
    @Max(24)
    startTime: number

    @IsNumber()
    @Min(1)
    @Max(8)
    usageTime: number

    @IsString()
    reason: string
}
