import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // FIXME: 추후 localhost와 실제 배포된 웹에서만 동작하도록 수정 필요
    app.enableCors()

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    const prismaService = app.get(PrismaService)
    prismaService.enableShutdownHooks(app)

    const config = new DocumentBuilder()
        .setTitle('sigma-intelligence-community-server')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swagger', app, document)

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
