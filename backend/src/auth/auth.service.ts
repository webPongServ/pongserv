import { Payload } from './strategy/jwt.payload';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Token42OAuthData } from './dto/token.dto';
import { DbUsersManagerService } from '../db-manager/db-users-manager/db-users-manager.service';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly dbmanagerUsersService: DbUsersManagerService,
    private jwtService: JwtService,
  ) {}

  logger = new Logger('AuthService');

  async issueToken42OAuth(code: string): Promise<Token42OAuthData> {
    let result: Token42OAuthData;
    try {
      const tokenResult = await this.httpService.axiosRef.post(
        'https://api.intra.42.fr/oauth/token',
        JSON.stringify({
          grant_type: 'authorization_code',
          client_id: this.config.get('API_UID'),
          client_secret: this.config.get('API_SECRET'),
          code,
          redirect_uri: this.config.get('REDIRECT_URI'),
        }),
        {
          headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
      result = {
        accessToken: tokenResult.data.access_token,
        refreshToken: tokenResult.data.refresh_token,
      };
      this.logger.log('42 token 발급 성공');
    } catch (err) {
      this.logger.log('42 token 발급 실패');
      throw new UnauthorizedException(
        '42 Token 발급 과정 중 실패(감자서버 에러)',
      );
    }
    return result;
  }

  async getIntraId(
    ftTokens: Token42OAuthData,
  ): Promise<{ intraId: string; intraImagePath: string }> {
    const intraInfoResult = await this.httpService.axiosRef.get(
      'https://api.intra.42.fr/v2/me',
      {
        headers: {
          Authorization: `Bearer ${ftTokens.accessToken}`,
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
    if (!intraInfoResult)
      throw new UnauthorizedException('Token42OAuth You are not 42 User');
    const intraId: string = intraInfoResult.data.login;
    const intraImagePath: string = intraInfoResult.data.image.link;
    this.logger.log(`42 유저 정보 조회 성공 : ${intraId}`);
    return { intraId, intraImagePath };
  }

  async processAuthorization(code42OAuth: string) {
    // Release
    const token42OAuth = await this.issueToken42OAuth(code42OAuth);
    const intraData: { intraId: string; intraImagePath: string } =
      await this.getIntraId(token42OAuth);
    // NOTE: TB_UA01M에 유저 자체가 있는지 검증하고 없으면 등록하는 로직 추가 (2023-05-08, mgo)
    const isMember = await this.dbmanagerUsersService.checkinUser(intraData);
    let OAuthData = false;
    if (await this.dbmanagerUsersService.checkOauth(intraData.intraId)) {
      OAuthData = true;
    }
    // Make AccessToken and return it
    const userId = intraData.intraId;
    const Payload = { userId };
    return {
      isMember,
      accessToken: await this.jwtService.signAsync(Payload),
      OAuthData,
      userId,
      imgPath: intraData.intraImagePath,
    };
  }

  async makeQrCode(userId: string) {
    const secret = speakeasy.generateSecret({
      length: 20,
      // Algorithm can be added (now removed for process)
    });
    await this.dbmanagerUsersService.applyTwofactor(userId, secret.base32);
    const QRCODE = await QRCode.toDataURL(secret.otpauth_url);
    const QrcodeImage = '<img src="' + QRCODE + '"/>';
    this.logger.log('QRCODE 발급 성공');
    return QrcodeImage;
  }

  async validateOtp(userId: string, sixDigit: string) {
    const secret = await this.dbmanagerUsersService.findSecret(userId);
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: sixDigit,
      window: 2,
      // Algorithm can be added (now removed for process)
    });
    const Payload = { userId };
    if (verified == true) {
      this.logger.log('OTP 발급 성공');
      return { accessToken: await this.jwtService.signAsync(Payload) };
    } else throw new BadRequestException('OTP Validation Failed');
  }

  async activate2fa(userId: string, sixDigit: string) {
    // console.log('IN ACTIVE\n\n', userId, sixDigit);
    if (sixDigit.length != 6)
      throw new BadRequestException('OTP Sholud be 6 digits');
    const secret = await this.dbmanagerUsersService.findSecret(userId);
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: sixDigit,
      window: 2,
      // Algorithm can be added (now removed for process)
    });
    if (verified == true) {
      await this.dbmanagerUsersService.activate2fa(userId);
      this.logger.log('OTP 발급 성공');
      return { success: true };
    } else throw new BadRequestException('OTP Validation Failed');
  }

  async verifyAsync(token) {
    return await this.jwtService.verifyAsync(token);
  }

  async disable2FA(intraId: string) {
    const user = await this.dbmanagerUsersService.getUserByUserId(intraId);
    if (user) {
      user.twofactor = false;
      await this.dbmanagerUsersService.saveUser(user);
      this.logger.log(`2FA 비활성화: ${intraId}`);
      return { twofactor: false };
    } else {
      this.logger.error(`사용자 정보를 찾을 수 없음: ${intraId}`);
      // throw new BadRequestException('사용자의 정보를 확인할 수 없습니다.');
    }
  }
}
