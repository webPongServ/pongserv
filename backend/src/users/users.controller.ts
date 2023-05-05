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

    // return await this.UsersService.loginProcess(userId);
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
