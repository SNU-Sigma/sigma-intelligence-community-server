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
import { Config } from './config'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule.forRoot({ isGlobal: true }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const { email, host, userName } = Config.mailing
                const password = configService.get<string>(
                    'EMAIL_AUTH_PASSWORD',
                )
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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
