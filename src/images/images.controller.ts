import { Controller, Get, Query } from '@nestjs/common'
import { ImagesService } from './images.service'
import { PreSignedUrlDto } from './dto/pre-signed-url.dto'
import { ApiTags } from '@nestjs/swagger'

@Controller('images')
@ApiTags('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @Get('pre-signed-url')
    async getPreSignedUrl(
        @Query('fileName') fileName: string,
    ): Promise<PreSignedUrlDto> {
        const { url, uploadedUrl } =
            await this.imagesService.createPreSignedUrlFromFileName(fileName)
        return {
            url,
            uploadedUrl,
        }
    }
}
