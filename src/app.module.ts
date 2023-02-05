import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigService } from './config/config.service'
import { ConfigModule } from './config/config.module'
import { AwsModule } from './aws/aws.module'
import { ImagesModule } from './images/images.module'
import { PrismaModule } from 'nestjs-prisma'
import { AuthModule } from './auth/auth.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { ReactAdapter } from '@webtre/nestjs-mailer-react-adapter'
import { PrinterReservationModule } from './printer-reservation/printer-reservation.module'
import { AdministratorModule } from './administrator/administrator.module'
import { PostsModule } from './posts/posts.module'

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
        AwsModule,
        ImagesModule,
        AuthModule,
        PrinterReservationModule,
        AdministratorModule,
        PostsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
