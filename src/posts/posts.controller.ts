import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { ExtractUser } from 'src/utility/decorators/extract-user.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { PostDto, PostFeedDto } from './dto/post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostsService } from './posts.service'

@Controller('posts')
@ApiTags('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Get('/all-posts')
    getAllPosts(@ExtractUser() user: User): Promise<Array<PostFeedDto>> {
        return this.postsService.getAllPosts(user)
    }

    @Get('/my-posts')
    getAllPostsOfUser(@ExtractUser() user: User): Promise<Array<PostDto>> {
        return this.postsService.getAllPostsOfUser(user)
    }

    @Post()
    createPost(
        @Body() createPostDto: CreatePostDto,
        @ExtractUser() user: User,
    ): Promise<PostDto> {
        console.log(createPostDto)
        return this.postsService.createPost(createPostDto, user)
    }

    @Patch('/:id')
    updatePost(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePostDto: UpdatePostDto,
        @ExtractUser() user: User,
    ): Promise<PostDto> {
        return this.postsService.updatePost(id, updatePostDto, user)
    }

    @Delete('/:id')
    deletePost(
        @Param('id', ParseIntPipe) id: number,
        @ExtractUser() user: User,
    ): Promise<PostDto> {
        return this.postsService.deletePost(id, user)
    }
}
