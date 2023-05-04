import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { Account } from '../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          console.log(`refresh token : ${req.cookies.refreshToken}`);
          return req.cookies.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<Account> {
    if (payload.uid === null) {
      throw new HttpException('Invalid Account', HttpStatus.FORBIDDEN);
    }

    const account: Account = await this.accountRepository.findOne({
      where: { uid: payload.uid },
    });

    const storedRefreshToken = req.cookies.refreshToken;
    console.log(`request token: ${storedRefreshToken}`);
    console.log(`db token: ${account.refreshToken}`);
    if (storedRefreshToken !== account.refreshToken) {
      await this.accountRepository.save({
        uid: account.uid,
        refreshToken: '',
      });
      throw new HttpException('유효하지 않은 토큰', HttpStatus.UNAUTHORIZED);
    }

    return account;
  }
}
