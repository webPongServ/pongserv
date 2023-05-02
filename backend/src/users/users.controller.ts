import { UsersService } from './users.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @ApiResponse({
    status: 201,
    description: '로그인 API',
  })
  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  login() {
    return 'login ()';
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
