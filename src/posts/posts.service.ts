import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { CreatePostDto } from './dto/create-post.dto'
import { PostDto, PostFeedDto } from './dto/post.dto'

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) {}

    async getAllPosts(user: User): Promise<Array<PostFeedDto>> {
        const allPosts = await this.prisma.post.findMany({
            include: { user: { include: { profile: true } } },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return allPosts.map((postDto) => {
            return {
                ...postDto,
                isMyPost: postDto.userId === user.id,
            }
        })
    }

    async getAllPostsOfUser(user: User): Promise<Array<PostDto>> {
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
