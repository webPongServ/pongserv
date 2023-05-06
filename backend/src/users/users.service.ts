import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
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
    return await this.dbmanagerUsersService.getMe(intraId);
  }

  async changeNickname(intraId: string, nickname: string) {
    // return null;
    return await this.dbmanagerUsersService.changeNickname(intraId, nickname);
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
