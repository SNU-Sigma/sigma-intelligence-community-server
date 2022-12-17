import { Injectable } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class AwsService {
    private readonly s3Client: S3Client

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId:
                    configService.get<string>('AWS_ACCESS_KEY_ID') ??
                    (() => {
                        throw new Error(
                            'AWS_ACCESS_KEY_ID 환경변수가 빠져있습니다.',
                        )
                    })(),
                secretAccessKey:
                    configService.get<string>('AWS_SECRET_ACCESS_KEY') ??
                    (() => {
                        throw new Error(
                            'AWS_SECRET_ACCESS_KEY 환경변수가 빠져있습니다.',
                        )
                    })(),
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
