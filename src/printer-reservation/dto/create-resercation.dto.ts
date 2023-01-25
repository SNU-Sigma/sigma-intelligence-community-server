import { IsISO8601, IsNumber, IsString, Max, Min } from 'class-validator'

export class CreateReservationDto {
    @IsNumber()
    printerId: number

    @IsString()
    @IsISO8601({ strict: true, strictSeparator: true })
    startDateTime: string

    @IsNumber()
    @Min(1)
    @Max(8)
    usageTime: number

    @IsString()
    reason: string
}
