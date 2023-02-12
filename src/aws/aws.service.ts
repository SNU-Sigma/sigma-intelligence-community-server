import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
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

    // FIXME: 추후에는 S3Stream 자체를 만들어서 return해주기 (지금은 s3-streamlogger에 의존)
    getSharedConfigurationForLogging() {
        return {
            region: config.region,
            bucketName: config.bucketName,
            folderName: 'logs-v1',
            ...this.configService.select(({ aws }) => aws),
        }
    }
}

const config = {
    region: 'ap-northeast-2',
    bucketName: 'sigma-intel-bucket',
    expiresIn: 60,
} as const
