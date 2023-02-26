import { PartialType, PickType } from '@nestjs/swagger'
import { UserProfileDto } from '../../common/dto/user-profile.dto'

export class UpdateUserProfileDto extends PartialType(
    PickType(UserProfileDto, ['profileImageUrl', 'major', 'freshmanYear']),
) {}
