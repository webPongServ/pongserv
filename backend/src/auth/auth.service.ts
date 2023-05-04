import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Token42OAuthData } from './dto/token.dto';
import { DbUsersManagerService } from '../db-manager/db-users-manager/db-users-manager.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly dbmanagerUsersService: DbUsersManagerService,
    private jwtService: JwtService
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

  async getIntraId(ftTokens: Token42OAuthData): Promise<string> {
    let intraId: string;

    console.log(`ftTokens: `);
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
      throw new UnauthorizedException('Token42OAuth');
    intraId = intraInfoResult.data.login;
    return intraId;
  }

  async checkinUser(intraId) {
    // get user or set user in db
    const user = await this.dbmanagerUsersService.getUserInfoByIntraId(intraId);
    if (user === null) {
      // await this.dbmanagerUsersService.setOne()
    }
  }

  async issueAccessToken(intraId): Promise<string> {
    const payload = { intraId };
    let access_token = await this.jwtService.sign(payload);
    return ;
  }

  async processAuthorization(code42OAuth: string) {
    const token42OAuth = await this.issueToken42OAuth(code42OAuth);
    const intraId: string = await this.getIntraId(token42OAuth);
    console.log(`intraId: ${intraId}`);
    // TODO: user checkin (DB)
    await this.dbmanagerUsersService.checkinUser(intraId);
    // TODO: issue access and refresh tokens
    const tokenTmp = await this.issueAccessToken(intraId);
    return intraId;
  }
}
