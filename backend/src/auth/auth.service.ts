import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Token42OAuthData } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}
  async issueToken(code: string): Promise<Token42OAuthData> {
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
    // console.log(result);
    return result;
  }

  async getIntraId(ftTokens: Token42OAuthData): Promise<string> {
    let intraInfo;
    let uid;

    try {
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

      intraInfo = {
        intraId: intraInfoResult.data.login,
        imageUrl: intraInfoResult.data.image.link,
      };
    } catch (err) {
      console.log('42 사용자 정보 확인 실패');
      throw new HttpException('message', HttpStatus.UNAUTHORIZED);
    }

    // try {
    //   const user: Account = await await this.accountRepository.findOne({
    //     where: { intraId: intraInfo.intraId },
    //   });

    //   if (user === null) {
    //     const insertedData = await this.accountRepository.save({
    //       intraId: intraInfo.intraId,
    //       imageUrl: intraInfo.imageUrl,
    //     });
    //     uid = insertedData.uid;
    //   } else {
    //     uid = user.uid;
    //   }
    // } catch (err) {
    //   console.log('사용자 정보 저장 실패');
    //   throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    // }

    // const accessToken = this.jwtService.sign(
    //   {
    //     uid,
    //     intraId: intraInfo.intraId,
    //   },
    //   {
    //     expiresIn: this.config.get('JWT_ACCESS_EXPIRE'),
    //   },
    // );

    // const refreshToken = this.jwtService.sign(
    //   {
    //     uid,
    //   },
    //   {
    //     expiresIn: this.config.get('JWT_REFRESH_EXPIRE'),
    //   },
    // );

    // try {
    //   const updatedResult = await this.accountRepository.update(
    //     { uid },
    //     { refreshToken },
    //   );

    //   if (updatedResult.affected === 0) {
    //     throw new InternalServerErrorException('토큰 저장 실패');
    //   }
    // } catch (err) {
    //   console.log('refresh token 삽입 에러');
    //   throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    // }

    // return {
    //   accessToken,
    //   refreshToken,
    //   ftAccessToken,
    //   imageUrl: intraInfo.imageUrl,
    // };

    // console.log(`ftTokens.acessToken: ${ftTokens.accessToken}`);
    // console.log(`ftTokens.refreshToken: ${ftTokens.refreshToken}`);
    return intraInfo.intraId;
  }
}
