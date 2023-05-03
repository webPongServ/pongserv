import { UsersService } from './users.service';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
