import { Post } from '@prisma/client'

export class PostDto implements Post {
    id: number
    createdAt: Date
    updatedAt: Date
    title: string
    description: string
    images: Array<string>
    userId: number
}
