import { Injectable } from '@nestjs/common'
import { AwsService } from '../aws/aws.service'
import * as uuid from 'uuid'

@Injectable()
export class ImagesService {
    constructor(private awsService: AwsService) {}

    async createPreSignedUrlFromFileName(fileName: string) {
        const uniqueName = uuid.v4() + fileName
        const url = await this.awsService.createPreSignedUrl(uniqueName)
        // FIXME: 하드코딩 제거 & sigma-intelligence.com 도메인으로 변경
        const uploadedUrl =
            'https://d287xoiphv5ynk.cloudfront.net/' + uniqueName
        return {
            url,
            uploadedUrl,
        }
    }
}
