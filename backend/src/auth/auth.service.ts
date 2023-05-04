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
    if (!intraInfoResult) throw new UnauthorizedException('Token42OAuth');
    const intraId: string = intraInfoResult.data.login;
    const intraImagePath: string = intraInfoResult.data.image.link;
    return { intraId, intraImagePath };
  }

  async checkinUser(intraId) {
    // get user or set user in db
    const user = await this.dbmanagerUsersService.getUserInfoByIntraId(intraId);
    if (user === null) {
      // await this.dbmanagerUsersService.setOne()
    }
  }

  async issueAccessToken(intraId: string): Promise<string> {
    const payload = { intraId };
    const accessToken = await this.jwtService.sign(payload);
    return accessToken;
  }

  async processAuthorization(code42OAuth: string) {
    // const token42OAuth = await this.issueToken42OAuth(code42OAuth);
    // const intraData: { intraId: string; intraImagePath: string } =
    //   await this.getIntraId(token42OAuth);
    // DEBUG
    const intraData = { intraId: 'susong', intraImagePath: '' };
    // console.log(`intraId: ${intraId}`);
    // TODO: user checkin (DB)
    await this.dbmanagerUsersService.checkinUser(intraData);
    // TODO: issue access and refresh tokens
    // const accessToken = await this.issueAccessToken(intraData.intraId);
    const intraId = intraData.intraId;
    const payload = { intraId };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
