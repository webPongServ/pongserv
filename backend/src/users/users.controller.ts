import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  HttpStatus,
  HttpException,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ConfigService } from '@nestjs/config';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @ApiResponse({
    status: 201,
    description: '로그인 API',
  })
  @ApiOperation({ summary: '로그인' })
  @Get('/login')
  async login(
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (
      !authHeader ||
      (await this.UsersService.verifyToken(authHeader)) == null
    ) {
      console.log('redirect');
      try {
        res.redirect(
          `https://api.intra.42.fr/oauth/authorize?client_id=${this.config.get(
            'API_UID',
          )}&redirect_uri=${this.config.get(
            'REDIRECT_URI',
          )}&response_type=code`,
        );
      } catch (err) {
        throw new HttpException(err, HttpStatus.FORBIDDEN);
      }
    } else {
      res.redirect('http://localhost:3001/game');
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Access Token 기반 자신의 간단한 정보를 가져온다.',
  })
  @ApiOperation({ summary: '로그인' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('/me')
  async me(@CurrentUser() user: string) {
    return this.UsersService.getMe(user);
  }

  @ApiResponse({
    status: 201,
    description: 'NickName 변경 성공!.',
  })
  @ApiOperation({ summary: 'NickName 변경' })
  @UseGuards(JwtAccessTokenGuard)
  @Post('/nickname')
  async changeNickname(@CurrentUser() user: string, @Body() body: any) {
    if (body.nickname.length > 8) {
      throw new HttpException(
        '닉네임은 8자 이하로 입력해주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.UsersService.changeNickname(user, body.nickname);
  }
}
