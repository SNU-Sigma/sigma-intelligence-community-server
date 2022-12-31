import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClientExceptionFilter } from 'nestjs-prisma'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // FIXME: 추후 localhost와 실제 배포된 웹에서만 동작하도록 수정 필요
    app.enableCors()

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    const prismaService = app.get(PrismaService)
    prismaService.enableShutdownHooks(app)

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
