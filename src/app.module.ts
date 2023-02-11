import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ReactAdapter } from '@webtre/nestjs-mailer-react-adapter'
import { LoggerModule } from 'nestjs-pino'
import { PrismaModule } from 'nestjs-prisma'
import { S3StreamLogger } from 's3-streamlogger'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { AwsModule } from './aws/aws.module'
import { AwsService } from './aws/aws.service'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'
import { ImagesModule } from './images/images.module'
import { PostsModule } from './posts/posts.module'
import { PrinterReservationModule } from './printer-reservation/printer-reservation.module'

@Module({
    imports: [
        ConfigModule,
        PrismaModule.forRoot({ isGlobal: true }),
        LoggerModule.forRootAsync({
            imports: [AwsModule],
            inject: [AwsService],
            useFactory: (awsService: AwsService) => {
                const {
                    region,
                    bucketName,
                    folderName,
                    secretAccessKey,
                    accessKeyId,
                } = awsService.getSharedConfigurationForLogging()
                const stream = new S3StreamLogger({
                    region,
                    bucket: bucketName,
                    folder: folderName,
                    access_key_id: accessKeyId,
                    secret_access_key: secretAccessKey,
                })
                stream.on('error', (error) => {
                    console.error(error)
                    // FIXME: S3 업로드 중에 발생하는 에러 처리하기
                })
                return {
                    pinoHttp:
                        process.env.NODE_ENV === 'production'
                            ? {
                                  stream,
                                  customProps: () => ({ context: 'HTTP' }),
                                  level: 'info',
                              }
                            : {
                                  transport: { target: 'pino-pretty' },
                                  level: 'debug',
                              },
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
