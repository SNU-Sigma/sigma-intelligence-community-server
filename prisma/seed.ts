import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const userCount = 20
    const hashedPassword = await bcrypt.hash('1111', 10)
    await Promise.all(
        Array.from({ length: userCount }, (_, index) => {
            const email = `test${index.toString().padStart(4, '0')}@snu.ac.kr`
            return prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    profile: {
                        create: {
                            name: Array.from({ length: 3 }, () =>
                                String.fromCharCode(
                                    44031 + Math.ceil(11172 * Math.random()),
                                ),
                            ).join(''),
                        },
                    },
                    userAuth: {
                        create: {
                            hashedPassword,
                        },
                    },
                },
            })
        }),
    )
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
