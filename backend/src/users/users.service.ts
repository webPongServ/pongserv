import { start } from 'repl';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { DbGamesManagerService } from 'src/db-manager/db-games-manager/db-games-manager.service';
import * as fs from 'fs-extra';
import * as path from 'path';
import { config } from 'dotenv';
import { ChatsService } from 'src/chats/chats.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly AuthService: AuthService,
    private readonly JwtService: JwtService,
    private readonly dbmanagerUsersService: DbUsersManagerService,
    private readonly DbGamesManagerService: DbGamesManagerService,
    private readonly config: ConfigService,
    private readonly chatsService: ChatsService,
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
    const resultOfMade = await this.dbmanagerUsersService.makeFriend(
      myEntity,
      friendEntity,
    );
    if (resultOfMade.result === 'Success') {
      const frndCurrLogin = await this.dbmanagerUsersService.getCurrLoginData(
        friendEntity,
      );
      if (frndCurrLogin) {
        if (frndCurrLogin.stsCd === '02') return { isCurrStatus: '02' }; // game
        else return { isCurrStatus: '01' }; // login
      } else {
        return { isCurrStatus: '03' }; // logout
      }
    }
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

  async getProfilebyNickname(intraId: string, friendNickname: string) {
    const friendUserId = await this.dbmanagerUsersService.findUserIdByNickname(
      friendNickname,
    );
    const Profile = await this.dbmanagerUsersService.getFriendProfile(
      intraId,
      friendUserId,
    );
    const gameSummary = await this.DbGamesManagerService.getGameSummary(
      friendUserId,
    );
    Profile.isblocked = await this.chatsService.isTargetBlockedByUser(
      intraId,
      friendNickname,
    );
    Profile.ELO = gameSummary.ladder;
    Profile.winRate = gameSummary.winRate * 100;
    Profile.total = gameSummary.total;
    Profile.win = gameSummary.win;
    Profile.lose = gameSummary.lose;
    // console.log('Profile is ', Profile, '\n\nGameSummary', gameSummary);
    return Profile;
  }
  async getProfile(intraId: string) {
    const Profile = await this.dbmanagerUsersService.getFriendProfile(
      intraId,
      intraId,
    );
    const gameSummary = await this.DbGamesManagerService.getGameSummary(
      intraId,
    );
    Profile.ELO = gameSummary.ladder;
    Profile.winRate = gameSummary.winRate * 100;
    Profile.total = gameSummary.total;
    Profile.win = gameSummary.win;
    Profile.lose = gameSummary.lose;
    Profile.isblocked = false;
    return await this.dbmanagerUsersService.getProfile(intraId);
  }

  async getFriendList(userId: string) {
    /*!SECTION
      제공해야하는 데이터: nickname, imgPath, isCurrLogin
      1. friend list 가져오기
      2. 각 친구별로 현재 로그인 상태 가져오기
    */
    const results: {
      nickname: string;
      imageUrl: string;
      currStat: string;
    }[] = [];
    // 1
    const myEntity = await this.dbmanagerUsersService.getMasterEntity(userId);
    const friendDatas = await this.dbmanagerUsersService.getFriendList(
      myEntity,
    );
    // 2
    for (const eachFriendData of friendDatas) {
      const currLogin = await this.dbmanagerUsersService.getCurrLoginData(
        eachFriendData.ua01mEntityAsFr,
      );
      let statusCode: string = null;
      if (currLogin) statusCode = currLogin.stsCd;
      else statusCode = '03';
      const eachToPush = {
        nickname: eachFriendData.ua01mEntityAsFr.nickname,
        imageUrl: eachFriendData.ua01mEntityAsFr.imgPath,
        currStat: statusCode, // NOTE: It will be true if currLogin exists, false otherwise.
        // TODO: isCurrStatus 로 바꿔서 login, gaming, logout 상태 표시하도록 변경
      };
      results.push(eachToPush);
    }
    return results;
  }

  async getFriendUserIds(userId: string) {
    const user = await this.dbmanagerUsersService.getUserByUserId(userId);
    const friendDatas = await this.dbmanagerUsersService.getFriendList(user);
    const retFrndUserIds: string[] = [];
    for (const eachData of friendDatas) {
      retFrndUserIds.push(eachData.ua01mEntityAsFr.userId);
    }
    return retFrndUserIds;
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

  async processLogin(userId: string) {
    /*!SECTION
      1. userId에 해당하는 user master entity 찾기
      2. 해당 유저의 status에 login 데이터 추가
    */
    // 1
    const user = await this.dbmanagerUsersService.getUserByUserId(userId);
    if (!user) throw new NotFoundException(`The user not existed.`);
    // 2
    const loginData = await this.dbmanagerUsersService.addLoginData(user);
    console.log(`loginData: `);
    console.log(loginData);
    return;
  }

  async processLogout(userId: string) {
    /*!SECTION
      1. userId에 해당하는 user master entity 찾기
      2. 해당 유저의 status에 login 비활성화
    */
    // 1
    const user = await this.dbmanagerUsersService.getUserByUserId(userId);
    if (!user) throw new NotFoundException(`The user not existed.`);
    const logoutData = await this.dbmanagerUsersService.setLoginFinsh(user);
    console.log(`logoutData: `);
    console.log(logoutData);
    return;
  }

  async getGameRecord(userId: string, friendNickname: string = null) {
    // Nickname을 받아서, 해당 인원의 userId를 찾아서, 그 userId로 게임 기록을 가져온다.
    const friendUserId = friendNickname
      ? await this.dbmanagerUsersService.findUserIdByNickname(friendNickname)
      : userId;
    const userEntity = await this.dbmanagerUsersService.getMasterEntity(
      friendUserId,
    );
    const gameRecord = await this.DbGamesManagerService.getUserStatic(
      userEntity,
    );
    return gameRecord;
  }

  async achievement(userId: string, friendNickname: string = null) {
    const winAchievement = ['WIN1', 'WIN10', 'WIN100', 'WIN1000'];
    const lossAchievement = ['LOSS1', 'LOSS10', 'LOSS100', 'LOSS1000'];
    const friendAchievement = [
      'FRIEND1',
      'FRIEND10',
      'FRIEND100',
      'FRIEND1000',
    ];
    const friendUserId = friendNickname
      ? await this.dbmanagerUsersService.findUserIdByNickname(friendNickname)
      : userId;
    const gameSummary = await this.DbGamesManagerService.getGameSummary(
      friendUserId,
    );
    const friendList = await this.getFriendList(friendUserId);
    const totalAchievement = [];
    if (gameSummary.win > 0)
      totalAchievement.push(
        ...winAchievement.slice(0, gameSummary.win.toString().length),
      );
    if (gameSummary.lose > 0)
      totalAchievement.push(
        ...lossAchievement.slice(0, gameSummary.lose.toString().length),
      );
    if (friendList.length > 0)
      totalAchievement.push(
        ...friendAchievement.slice(0, friendList.length.toString().length),
      );
    return totalAchievement;
  }
}
