import { BadRequestException, PipeTransform } from '@nestjs/common'
import { isDate } from 'class-validator'

export class ParseDatePipe implements PipeTransform {
    transform(value: string) {
        if (!isDate(value)) {
            throw new BadRequestException(`${value} isn't Date format`)
        }

        return new Date(value)
    }
}
