import {
  HttpException,
  HttpStatus,
  Injectable,
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
          },
        },
      );
      result = {
        accessToken: tokenResult.data.access_token,
        refreshToken: tokenResult.data.refresh_token,
      };
    } catch (err) {
      console.log('42 token 발급 실패');
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
    return result;
  }

  async getIntraId(
    ftTokens: Token42OAuthData,
  ): Promise<{ intraId: string; intraImagePath: string }> {
    console.log(`42Tokens: `);
    console.log(ftTokens);
    const intraInfoResult = await this.httpService.axiosRef.get(
      'https://api.intra.42.fr/v2/me',
      {
        headers: {
          Authorization: `Bearer ${ftTokens.accessToken}`,
          'content-type': 'application/json',
        },
      },
    );
    if (!intraInfoResult)
      throw new UnauthorizedException('Token42OAuth You are not 42 User');
    const intraId: string = intraInfoResult.data.login;
    const intraImagePath: string = intraInfoResult.data.image.link;
    return { intraId, intraImagePath };
  }

  async checkinUser(intraId) {
    // get user or set user in db
    const user = await this.dbmanagerUsersService.getUserByUserId(intraId);
    if (user === null) {
      // await this.dbmanagerUsersService.setOne()
    }
  }

  async processAuthorization(code42OAuth: string) {
    // Release
    const token42OAuth = await this.issueToken42OAuth(code42OAuth);
    const intraData: { intraId: string; intraImagePath: string } =
      await this.getIntraId(token42OAuth);
    // DEBUG
    // const intraData = { intraId: 'susong', intraImagePath: '' };
    // TODO: user checkin (DB)
    if (await this.dbmanagerUsersService.checkOauth(intraData.intraId)) {
      console.log('OAuth Needed');
    }
    await this.dbmanagerUsersService.checkinUser(intraData);
    // Make AccessToken and return it
    const intraId = intraData.intraId;
    const payload = { intraId };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async makeQrCode(userId: string) {
    const secret = speakeasy.generateSecret({
      length: 6,
      // name: userId,
      algorithm: 'sha512',
    });
    console.log(userId);
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: userId,
      issuer: 'pongserv',
      algorithm: 'sha512',
      digits: 6,
      period: 60,
    });
    await this.dbmanagerUsersService.applyTwofactor(userId, secret.base32);
    return await QRCode.toDataURL(url);
  }

  async validateOtp(userId: string, sixDigit: string) {
    console.log(sixDigit);

    const secret = await this.dbmanagerUsersService.findSecret(userId);
    console.log(secret);
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      algorithm: 'sha512',
      token: sixDigit,
      window: 2,
    });
    console.log(verified);
    return verified;
  }
}
