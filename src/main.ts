import { ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma'
import { AppModule } from './app.module'
import { ConfigService } from './config/config.service'
import { herokuSSLRedirect } from './utility/middleware/herokuSSLRedirect'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
    app.use(herokuSSLRedirect())

    app.enableCors({
        origin: [
            // Local
            /http:\/\/localhost:.*/,
            // Production
            'https://web.sigma-intelligence.com',
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
    await app.listen(configService.select(({ port }) => port))
}

bootstrap()
