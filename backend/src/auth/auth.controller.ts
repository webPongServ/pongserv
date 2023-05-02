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
  @ApiInternalServerErrorResponse({ description: 'code 발급 실패' })
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

  @Post('token')
  async issueToken(@Body() codeBody: { code: string }) {
    try {
      // const result = await this.authService.issueToken(codeBody.code);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
