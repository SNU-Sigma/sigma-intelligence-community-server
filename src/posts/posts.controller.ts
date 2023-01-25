import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { PostsService } from './posts.service'
import { User, Post as PostModel } from '@prisma/client'
import { ApiTags } from '@nestjs/swagger'
import { ExtractUser } from 'src/utility/decorators/extract-user.decorator'

@Controller('posts')
@ApiTags('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Get('/')
    getAllPost(@ExtractUser() user: User) {
        return this.postsService.getAllPost(user)
    }

    @Post()
    createPost(
        @Body() createPostDto: CreatePostDto,
        @ExtractUser() user: User,
    ): Promise<PostModel> {
        console.log(createPostDto)
        return this.postsService.createPost(createPostDto, user)
    }
}
