import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity.js';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @InjectRepository(TbUa01MEntity)
    private readonly ua01mRp: Repository<TbUa01MEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: "ChanhyleISHandsome",
    });
  }

  async validate(payload: any): Promise<TbUa01MEntity> {
    const { nickname } = payload;
    const user = await this.ua01mRp.findOne({
      where: {
        nickname: nickname,
      }
    });
    if (user === null) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
