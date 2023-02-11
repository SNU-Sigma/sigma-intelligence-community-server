import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ReactAdapter } from '@webtre/nestjs-mailer-react-adapter'
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
} from 'nest-winston'
import { PrismaModule } from 'nestjs-prisma'
import { S3StreamLogger } from 's3-streamlogger'
import { format, transports } from 'winston'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { AwsModule } from './aws/aws.module'
import { AwsService } from './aws/aws.service'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'
import { ImagesModule } from './images/images.module'
import { LoggerModule } from './logger/logger.module'
import { PostsModule } from './posts/posts.module'
import { PrinterReservationModule } from './printer-reservation/printer-reservation.module'

@Module({
    imports: [
        ConfigModule,
        PrismaModule.forRoot({ isGlobal: true }),
        WinstonModule.forRootAsync({
            imports: [AwsModule],
            inject: [AwsService],
            useFactory: (awsService: AwsService) => {
                const s3Transports = (() => {
                    if (process.env.NODE_ENV !== 'production') {
                        return []
                    }
                    const {
                        region,
                        bucketName,
                        folderName,
                        secretAccessKey,
                        accessKeyId,
                    } = awsService.getSharedConfigurationForLogging()
                    const transport = new transports.Stream({
                        stream: new S3StreamLogger({
                            region,
                            bucket: bucketName,
                            folder: folderName,
                            access_key_id: accessKeyId,
                            secret_access_key: secretAccessKey,
                        }),
                        level: 'error', // FIXME: 추후 더 다양한 로깅 넣기
                    })
                    transport.on('error', () => {
                        // FIXME: S3 업로드 중에 발생하는 에러 처리하기
                    })
                    return [transport]
                })()
                return {
                    transports: [
                        new transports.Console({
                            format: format.combine(
                                format.timestamp(),
                                format.ms(),
                                nestWinstonModuleUtilities.format.nestLike(),
                            ),
                            level: 'verbose',
                        }),
                        ...s3Transports,
                    ],
                }
            },
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const { email, password, host, userName } =
                    configService.select(({ mailing }) => mailing)
                return {
                    transport: `smtps://${email}:${password}@${host}`,
                    defaults: {
                        from: `"${userName}" <${email}>`,
                    },
                    template: {
                        dir: __dirname + '/templates',
                        adapter: new ReactAdapter(),
                    },
                }
            },
            inject: [ConfigService],
        }),
        LoggerModule,
        AwsModule,
        ImagesModule,
        AuthModule,
        PrinterReservationModule,
        PostsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
