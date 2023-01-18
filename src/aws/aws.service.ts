import { Injectable } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ConfigService } from '../config/config.service'

@Injectable()
export class AwsService {
    private readonly s3Client: S3Client

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: config.region,
            credentials: {
                ...configService.select(({ aws }) => aws),
            },
        })
    }

    async createPreSignedUrl(uniqueName: string) {
        const command = new PutObjectCommand({
            Bucket: config.bucketName,
            Key: uniqueName,
        })

        return getSignedUrl(this.s3Client, command, {
            expiresIn: config.expiresIn,
        })
    }
}

const config = {
    region: 'ap-northeast-2',
    bucketName: 'sigma-intel-bucket',
    expiresIn: 60,
} as const
