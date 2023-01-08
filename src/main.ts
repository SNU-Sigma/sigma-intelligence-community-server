import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors({
        origin: [
            // Local
            /http:\/\/localhost:.*/,
            // TODO: 커스텀 도메인으로 변경
            // Vercel Production
            'https://sigma-intelligence-community.vercel.app/',
            // Vercel Preview
            /https:\/\/sigma-intelligence-community-.+-sigma-intelligence\.vercel\.app/,
        ],
        credentials: true,
    })

    app.use(cookieParser())

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    const prismaService = app.get(PrismaService)
    await prismaService.enableShutdownHooks(app)

    const { httpAdapter } = app.get(HttpAdapterHost)
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

    const config = new DocumentBuilder()
        .setTitle('sigma-intelligence-community-server')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swagger', app, document)

    const configService = app.get(ConfigService)
    await app.listen(configService.get('PORT', 3000))
}

bootstrap()
