import { start } from 'repl';
import { ConfigService } from '@nestjs/config';
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
import { config } from 'dotenv';

@Injectable()
export class UsersService {
  constructor(
    private readonly AuthService: AuthService,
    private readonly JwtService: JwtService,
    private readonly dbmanagerUsersService: DbUsersManagerService,
    private readonly config: ConfigService,
  ) {}

  async verifyToken(token: string): Promise<any> {
    try {
      console.log(token);
      token = token.split(' ')[1];
      const decoded = await this.JwtService.verifyAsync(token);
      console.log(decoded);
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
    const IMAGE_URL = this.config.get('IMAGE_URL');
    const filePath = IMAGE_URL + fileName;
    await this.dbmanagerUsersService.changeImagePath(userId, filePath);
    return filePath;
  }

  async makeFriend(intraId: string, friendNickname: string) {
    //friendId는 닉네임으로 온다!
    const friendUserId = await this.dbmanagerUsersService.findUserIdByNickname(
      friendNickname,
    );
    const friendEntity = await this.dbmanagerUsersService.getMasterEntity(
      friendUserId,
    );
    const myEntity = await this.dbmanagerUsersService.getMasterEntity(intraId);
    return await this.dbmanagerUsersService.makeFriend(myEntity, friendEntity);
  }

  async deleteFriend(intraId: string, friendNickname: string) {
    //friendId는 닉네임으로 온다!
    const friendUserId = await this.dbmanagerUsersService.findUserIdByNickname(
      friendNickname,
    );
    const friendEntity = await this.dbmanagerUsersService.getMasterEntity(
      friendUserId,
    );
    const myEntity = await this.dbmanagerUsersService.getMasterEntity(intraId);
    return await this.dbmanagerUsersService.deleteFriend(
      myEntity,
      friendEntity,
    );
  }

  async getFriendProfile(intraId: string, friendId: string) {
    return await this.dbmanagerUsersService.getFriendProfile(intraId, friendId);
  }

  async getFriendList(intraId: string) {
    const myEntity = await this.dbmanagerUsersService.getMasterEntity(intraId);
    return await this.dbmanagerUsersService.getFriendList(myEntity);
  }

  async getUserList(startsWith: string) {
    console.log(startsWith);
    if (startsWith.length === 0) return [];
    const withPercent = startsWith + '%';
    return await this.dbmanagerUsersService.getUserList(withPercent);
  }

  async blockUser(nickName: string) {
    console.log('blockUser', nickName);
    const user = await this.dbmanagerUsersService.findUserIdByNickname(
      nickName,
    );
    if (user.length == 0) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }
  }
}