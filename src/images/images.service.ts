import { Injectable } from '@nestjs/common'
import { AwsService } from '../aws/aws.service'
import * as uuid from 'uuid'

@Injectable()
export class ImagesService {
    constructor(private awsService: AwsService) {}

    async createPreSignedUrlFromFileName(fileName: string) {
        const uniqueName = uuid.v4() + fileName
        const url = await this.awsService.createPreSignedUrl(uniqueName)
        return {
            url,
            uploadedUrl: url.split('?')[0] ?? url,
        }
    }
}
