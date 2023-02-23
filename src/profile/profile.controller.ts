import { Body, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { User, UserProfile } from '@prisma/client'
import { ExtractUser } from 'src/utility/decorators/extract-user.decorator'
import { UserProfileDto } from './dto/profile.dto'
import { ProfileService } from './profile.service'

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    userProfile: UserProfile
    updateProfile(
        @Body() userProfileDto: UserProfileDto,
        @ExtractUser() user: User,
    ): Promise<UserProfile> {
        return this.profileService.updateProfile(user.id, userProfileDto)
    }
}
