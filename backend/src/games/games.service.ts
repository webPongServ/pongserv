import { DbUsersManagerService } from './../db-manager/db-users-manager/db-users-manager.service';
import { roomOption } from './dto/roomOption.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbGamesManagerService } from 'src/db-manager/db-games-manager/db-games-manager.service';
@Injectable()
export class GamesService {
  constructor(
    private readonly DbGamesManagerService: DbGamesManagerService,
    private readonly DbUsersManagerService: DbUsersManagerService,
    private readonly configService: ConfigService,
  ) {}

  // GameRoom 생성한다.
  async createGameRoom(userId, message: roomOption) {
    const { type, roomName, difficulty, score } = message;
    const room = await this.DbGamesManagerService.createRoomList(
      type,
      roomName,
      difficulty,
      score,
      userId,
    );
    return room;
  }

  async createGameDetail(roomListEntity, userId, type) {
    const userEntity = await this.DbUsersManagerService.getUserByUserId(userId);
    await this.DbGamesManagerService.createRoomDetail(
      roomListEntity,
      userEntity,
      type,
    );
    return true;
  }

  async enterRoom(userId, roomId, type) {
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      roomId,
    );
    await this.createGameDetail(roomListEntity, userId, type);
  }

  async getRoomList() {
    const roomList = await this.DbGamesManagerService.getRoomList();
    return roomList;
  }

  async endGame(roomId) {
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      roomId,
    );
    await this.DbGamesManagerService.endGameList(roomListEntity);
  }

  async updateOpponent(opponent, roomId) {
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      roomId,
    );
    const owner = roomListEntity.owner;
    // Room ID 를 기준으로, 각각 상대편으로 등록한다.
    await this.DbGamesManagerService.updateOpponent(roomId, opponent, owner);
    await this.DbGamesManagerService.updateOpponent(roomId, owner, opponent);
    await this.DbGamesManagerService.updateOpponentList(roomId, opponent);
  }

  async startGame(userId, roomId) {
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      roomId,
    );
    await this.DbGamesManagerService.startGameList(roomListEntity);
  }

  async getUserStatic(nickname) {
    const userId = await this.DbUsersManagerService.findUserIdByNickname(
      nickname,
    );
    console.log(userId, '\n\n');
    this.DbGamesManagerService.getGameSummary(userId);
    const user = await this.DbUsersManagerService.getUserByUserId(userId);
    console.log(user, userId);
    const userStatic = await this.DbGamesManagerService.getUserStatic(user);
    return userStatic;
  }

  async dodgeGame(userId, roomId, myScore, opScore) {
    // 나의 점수와 상대 점수를 알아서 DB에 저장한다.
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      roomId,
    );
    // 승리자 결과 저장
    // List 를 주고,
    const opUserId =
      roomListEntity.owner == userId
        ? roomListEntity.opUserId
        : roomListEntity.owner;

    console.log('Dodge Game opUserId', opUserId, 'userId', userId, '\n\n\n');
    // console.log(roomListEntity);
    await this.DbGamesManagerService.SaveGame(
      roomListEntity,
      userId,
      '01',
      myScore,
      opScore,
    );
    // 나간사람 결과 저장
    await this.DbGamesManagerService.SaveGame(
      roomListEntity,
      opUserId,
      '02',
      opScore,
      myScore,
    );
  }

  async finishGame(userId, roomId, myScore, opScore) {
    // 나의 점수를 알아서 DB에 저장한다.
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      roomId,
    );
    //내가 이겼는지 졌는지 확인하기
    const winStatus = myScore > opScore ? '01' : '02';
    // 결과 저장
    await this.DbGamesManagerService.SaveGame(
      roomListEntity,
      userId,
      winStatus,
      myScore,
      opScore,
    );
  }

  async isInGame(userId: string) {
    return await this.DbGamesManagerService.isInGame(userId);
  }
}
