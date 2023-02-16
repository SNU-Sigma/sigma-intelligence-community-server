import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsArray()
    @ArrayMaxSize(10)
    @IsString({ each: true })
    images: Array<string>
}
