import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TbUa01MEntity } from '../db-manager/db-users-manager/entities/tb-ua-01-m.entity.ts';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<TbUa01MEntity> {
    if (payload.uid === null || payload.intra_id === null) {
      throw new HttpException('Invalid Account', HttpStatus.UNAUTHORIZED);
    }

    const account = new Account();
    account.uid = payload.uid;
    account.intraId = payload.intraId;

    return account;
  }
}
