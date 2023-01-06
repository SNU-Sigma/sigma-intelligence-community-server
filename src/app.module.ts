import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AwsModule } from './aws/aws.module'
import { ImagesModule } from './images/images.module'
import { PrismaModule } from 'nestjs-prisma'
import { AuthModule } from './auth/auth.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { ReactAdapter } from '@webtre/nestjs-mailer-react-adapter'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule.forRoot({ isGlobal: true }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const email = configService.get<string>('EMAIL_AUTH_EMAIL')
                const password = configService.get<string>(
                    'EMAIL_AUTH_PASSWORD',
                )
                const emailHost = configService.get<string>('EMAIL_HOST')
                const userName = configService.get<string>(
                    'EMAIL_FROM_USER_NAME',
                )
                return {
                    transport: `smtps://${email}:${password}@${emailHost}`,
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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
