import { Injectable } from '@nestjs/common'
import * as uuid from 'uuid'
import { AwsService } from '../aws/aws.service'

@Injectable()
export class ImagesService {
    constructor(private awsService: AwsService) {}

    private readonly folderName = 'user-images/'

    async createPreSignedUrlFromFileName(fileName: string) {
        const key = this.folderName + uuid.v4() + '_' + fileName
        const url = await this.awsService.createPreSignedUrl(key)
        const uploadedUrl = `${distributionBaseUrl}/${key}`
        return {
            url,
            uploadedUrl,
        }
    }
}

// AWS CloudFront distribution URL
const distributionBaseUrl = 'https://storage.sigma-intelligence.com'
