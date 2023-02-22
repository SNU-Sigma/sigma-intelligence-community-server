import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { CreatePostDto } from './dto/create-post.dto'
import { PostDto, PostFeedDto } from './dto/post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

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
            .posts({
                orderBy: {
                    createdAt: 'desc',
                },
            })
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

    async getPostById(id: number, user: User): Promise<PostDto> {
        const found = await this.prisma.post.findUnique({
            where: {
                id,
            },
        })
        if (!found) {
            throw new NotFoundException(`Can't find Post with id ${id}`)
        } else if (found.userId !== user.id) {
            throw new ForbiddenException('Unauthorized User')
        }
        return found
    }

    async updatePost(
        id: number,
        updatePostDto: UpdatePostDto,
        user: User,
    ): Promise<PostDto> {
        await this.getPostById(id, user)
        return this.prisma.post.update({
            where: { id },
            data: updatePostDto,
        })
    }

    async deletePost(id: number, user: User): Promise<PostDto> {
        await this.getPostById(id, user)
        return this.prisma.post.delete({ where: { id } })
    }
}
