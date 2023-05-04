/* eslint-disable no-console */
import { ConfigService } from '@nestjs/config';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Code42OAuthData } from './dto/code.dto';
import { Token42OAuthData } from './dto/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @ApiOperation({
    summary: '42 code 발급',
    description:
      '42 인트라 로그인 창으로 리다이렉션<br>로그인 성공 시 발급된 code를 가지고 /42oauth/token uri의 API로 리다이렉션',
  })
  @ApiResponse({ status: 302, description: '리다이렉션 성공' })
  @ApiInternalServerErrorResponse({ description: 'Token 발급 실패' })
  @Get('authorize')
  async issue42code(@Res({ passthrough: true }) res: Response) {
    try {
      res.redirect(
        `https://api.intra.42.fr/oauth/authorize?client_id=${this.config.get(
          'API_UID',
        )}&redirect_uri=${this.config.get('REDIRECT_URI')}&response_type=code`,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: '42 Token 발급',
    description:
      '42 Code를 벡엔드에 제공하고, 42API를 이용해서 Access Token과 Refresh Token을 발급받는다.',
  })
  @ApiResponse({ status: 200, description: '42Token 발급 성공' })
  @ApiInternalServerErrorResponse({ description: '토큰 발급 실패' })
  @Post('code')
  async issueToken(@Body() codeBody: Code42OAuthData) {
    console.log(`codeBody.code: ${codeBody.code}`);
    try {
      const accessToken = await this.authService.processAuthorization(
        codeBody.code,
      );
      return accessToken;
    } catch (err) {
      console.log(err);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
