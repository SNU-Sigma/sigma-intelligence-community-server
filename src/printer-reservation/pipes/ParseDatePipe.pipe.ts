import {
    ArgumentMetadata,
    BadRequestException,
    PipeTransform,
} from '@nestjs/common'
import { isDate } from 'class-validator'

export class ParseDatePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!isDate(value)) {
            throw new BadRequestException(`${value} isn't Date format`)
        }

        return new Date(value)
    }
}
