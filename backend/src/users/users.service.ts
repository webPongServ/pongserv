import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import * as fs from 'fs-extra';
import * as path from 'path';

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
      throw new BadRequestException('이미 존재하는 닉네임입니다!');
    } else {
      const user = await this.dbmanagerUsersService.getUserByUserId(intraId);
      if (user) {
        user.nickname = nickname;
        await this.dbmanagerUsersService.saveUser(user);
        console.log('Nickname is sucessfuly changed');
        return { new: nickname };
      } else {
        throw new BadRequestException('사용자의 정보를 확인할 수 없습니다.');
      }
    }
  }

  async checkNickname(nickname: string) {
    const isAvailable = await this.dbmanagerUsersService.checkNickname(
      nickname,
    );
    if (isAvailable) {
      return { result: true };
    } else return { result: false };
  }
  async getProfile(intraId: string) {
    return await this.dbmanagerUsersService.getProfile(intraId);
  }

  async changeImage(userId: string, base64Data: string) {
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new BadRequestException('Invalid base64 data');
    }
    const buffer = Buffer.from(matches[2], 'base64');
    const fileExtension = matches[1].split('/')[1];
    if (!['gif', 'png', 'jpg', 'jpeg'].includes(fileExtension)) {
      throw new BadRequestException('Invalid file type');
    }
    const fileName = `${userId}.${fileExtension}`;
    const uploadPath = path.resolve(__dirname, '../../', 'images', fileName);

    await fs.ensureDir(path.dirname(uploadPath));
    await fs.writeFile(uploadPath, buffer);
    await this.dbmanagerUsersService.changeImagePath(userId, fileName);
    return uploadPath;
  }

  async makeFriend(intraId: string, friendId: string) {
    return await this.dbmanagerUsersService.makeFriend(intraId, friendId);
  }

  async getFriendProfile(intraId: string, friendId: string) {
    return await this.dbmanagerUsersService.getFriendProfile(intraId, friendId);
  }
}
