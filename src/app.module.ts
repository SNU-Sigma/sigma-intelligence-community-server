import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ReactAdapter } from '@webtre/nestjs-mailer-react-adapter'
import { PrismaModule } from 'nestjs-prisma'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { AwsModule } from './aws/aws.module'
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
