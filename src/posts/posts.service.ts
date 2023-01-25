import { Injectable } from '@nestjs/common'
import { User, Post } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { CreatePostDto } from './dto/create-post.dto'

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) {}

    //테스트용
    getAllPost(user: User) {
        return `<h1>This is ${user.email}'s posts!<h1>`
    }

    async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
        const { title, description, images } = createPostDto
        return this.prisma.post.create({
            data: {
                title,
                description,
                images,
                userId: user.id,
            },
        })
    }
}
