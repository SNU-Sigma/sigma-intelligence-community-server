import { Prisma } from '@prisma/client'

const userIncludeProfile = Prisma.validator<Prisma.UserArgs>()({
    include: { profile: true },
})

export type UserIncludeProfile = Prisma.UserGetPayload<
    typeof userIncludeProfile
>
