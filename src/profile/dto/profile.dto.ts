import { UserProfile } from '@prisma/client'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UserProfileDto implements UserProfile {
    @IsNumber()
    id: number

    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    studentId: number | null

    @IsOptional()
    @IsString()
    major: string | null

    @IsOptional()
    @IsString()
    studentImage: string | null
}
