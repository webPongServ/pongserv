import { otpData } from './dto/otp.dto';
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
  UseGuards,
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
import { JwtAccessTokenGuard } from './guard/jwt.auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

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
  async issueToken(@Body() codeBody: Code42OAuthData, @Res() res: Response) {
    // console.log(`codeBody.code: ${codeBody.code}`);
    try {
      const accessToken = await this.authService.processAuthorization(
        codeBody.code,
      );
      if (accessToken == null) {
        res.redirect('http://localhost:3001/OAuth');
        return null;
      }
      res.setHeader('Set-Cookie', [
        `accessToken=${accessToken}; HttpOnly; SameSite=None;`,
      ]);
      console.log('IN THE AUTH/CODE', accessToken);
      // return { accessToken: accessToken };
      res.json({ accessToken: accessToken });
    } catch (err) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN, {
        cause: new Error('Something Happend in making Token'),
      });
    }
  }

  @ApiOperation({
    summary: '2차인증 QR 이미지 제공',
    description: '2차 인증을 위한 QR코드를 제작한다.',
  })
  @ApiResponse({ status: 200, description: '2차인증 QR 이미지 발급 성공' })
  @ApiInternalServerErrorResponse({ description: '권한 혹은 내부적 문제 발생' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('qr')
  async makeSecret(@CurrentUser() userId: string) {
    return this.authService.makeQrCode(userId);
  }

  @ApiOperation({
    summary: '2차인증 검증',
    description:
      '2차 인증 검증을 위해 body에 6digit을 담아 보낸다. 해당 6digit기반으로 verify',
  })
  @ApiResponse({ status: 200, description: '2차인증 성공' })
  @Post('otp')
  async checkOtp(@Body() otpData: otpData) {
    return this.authService.validateOtp(otpData.userId, otpData.sixDigit);
  }
}
