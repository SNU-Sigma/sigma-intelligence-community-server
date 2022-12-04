import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // FIXME: 추후 localhost와 실제 배포된 웹에서만 동작하도록 수정 필요
    app.enableCors()

    const prismaService = app.get(PrismaService)
    prismaService.enableShutdownHooks(app)

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
