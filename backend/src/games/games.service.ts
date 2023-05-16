import { DbUsersManagerService } from './../db-manager/db-users-manager/db-users-manager.service';
import { roomOption } from './dto/roomOption.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
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
    const room = await this.DbGamesManagerService.endGameList(roomListEntity);
    await this.DbGamesManagerService.endGameDetail(room.id);
  }

  async updateOpponent(opponent, roomId) {
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      roomId,
    );
    const owner = roomListEntity.owner;
    // Room ID 를 기준으로, 각각 상대편으로 등록한다.
    await this.DbGamesManagerService.updateOpponent(roomId, opponent, owner);
    await this.DbGamesManagerService.updateOpponent(roomId, owner, opponent);
  }

  async startGame(userId, roomId) {
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      roomId,
    );
    await this.DbGamesManagerService.startGameList(roomListEntity);
  }

  async getUserStatic(userId) {
    const user = await this.DbUsersManagerService.getUserByUserId(userId);
    const userStatic = await this.DbGamesManagerService.getUserStatic(user);
    return userStatic;
  }
}
