import { Post } from '@prisma/client'
import { UserDto } from 'src/common/dto/user.dto'

export class PostDto implements Post {
    id: number
    createdAt: Date
    updatedAt: Date
    title: string
    description: string
    images: Array<string>
    userId: number
}

export class PostFeedDto extends PostDto {
    user: UserDto
    isMyPost: boolean
}
