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
  constructor(private readonly dbUsersManagerService: DbUsersManagerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: 'ChanhyleISHandsome',
    });
  }

  async validate(payload: Payload): Promise<string> {
    const { intraId } = payload;
    const checked = await this.dbUsersManagerService.checkUserInDb(intraId);
    if (checked == null) {
      throw new UnauthorizedException();
    }
    return intraId;
  }

  // async checkUserInDb() {}
}
