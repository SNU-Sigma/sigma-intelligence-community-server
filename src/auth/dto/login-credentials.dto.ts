import { IsEmail } from 'class-validator'

export class LoginCredentialsDto {
    @IsEmail()
    email: string
    password: string
}
