import { UserProfile } from '@prisma/client'

export class UserProfileDto implements UserProfile {
    id: number
    name: string
    studentId: number | null
    major: string | null
    studentImage: string | null
}
