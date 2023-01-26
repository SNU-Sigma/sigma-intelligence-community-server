import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsString, Max, Min } from 'class-validator'

export class CreateReservationDto {
    @IsNumber()
    printerId: number

    @Type(() => Date)
    @IsDate()
    startDateTime: Date

    @IsNumber()
    @Min(1)
    @Max(8)
    usageTime: number

    @IsString()
    reason: string
}
