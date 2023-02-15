import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { CreatePostDto } from './dto/create-post.dto'
import { PostDto } from './dto/post.dto'

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) {}

    async getAllPosts(user: User): Promise<PostDto[]> {
        const allPosts: PostDto[] = await this.prisma.post.findMany({
            include: { user: { include: { profile: true } } },
        })
        for (const postDto of allPosts) {
            if (postDto.userId === user.id) {
                postDto.isMyPost = true
            } else {
                postDto.isMyPost = false
            }
        }
        return allPosts
    }

    async getAllPostsOfUser(user: User): Promise<PostDto[]> {
        return this.prisma.user
            .findUniqueOrThrow({
                where: { id: user.id },
            })
            .posts()
    }

    async createPost(
        createPostDto: CreatePostDto,
        user: User,
    ): Promise<PostDto> {
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
