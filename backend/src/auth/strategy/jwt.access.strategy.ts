import { ConfigService } from '@nestjs/config';
import { Payload } from './jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbUsersManagerService } from '../../db-manager/db-users-manager/db-users-manager.service.js';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly dbUsersManagerService: DbUsersManagerService,
  ) {
    const Secret = config.get('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Secret,
      // secretOrKey: 'ChanhyleISHandsome',
    });
  }

  async validate(payload: Payload): Promise<string> {
    const checked = await this.dbUsersManagerService.checkUserInDb(
      payload.userId,
    );
    // console.log('payload: ');
    // console.log(payload);
    return checked;
  }

  // async checkUserInDb() {}
}
