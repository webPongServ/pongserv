import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly AuthService: AuthService,
    private readonly JwtService: JwtService,
    private readonly dbmanagerUsersService: DbUsersManagerService,
  ) {}

  async verifyToken(token: string): Promise<any> {
    try {
      // console.log(token);
      token = token.split(' ')[1];
      const decoded = await this.JwtService.verifyAsync(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async getMe(intraId: string) {
    const user = await this.dbmanagerUsersService.getUserByUserId(intraId);
    if (user) {
      return {
        userId: user.userId,
        nickname: user.nickname,
        imgPath: user.imgPath,
        lastDttm: user.lastDttm,
      };
    } else {
      throw new BadRequestException('No User available');
    }
  }

  async changeNickname(intraId: string, nickname: string) {
    const nicknameExist = await this.dbmanagerUsersService.checkNickname(
      nickname,
    );
    if (nicknameExist) {
      throw new BadRequestException('Nickname already exists');
    } else {
      // const user = await this.dbmanagerUsersService.getUserByUserId(intraId);
      // if (user) {
      //   user.nickname = nickname;
      //   await this.dbmanagerUsersService.saveUser(user);
      //   console.log('Nickname is sucessfuly changed');
      //   return { Request: 'Success' };
      // } else {
      //   throw new BadRequestException('No User available');
      // }
    }
  }

  async getProfile(intraId: string) {
    return await this.dbmanagerUsersService.getProfile(intraId);
  }

  async makeFriend(intraId: string, friendId: string) {
    return await this.dbmanagerUsersService.makeFriend(intraId, friendId);
  }

  async getFriendProfile(intraId: string, friendId: string) {
    return await this.dbmanagerUsersService.getFriendProfile(intraId, friendId);
  }
}
