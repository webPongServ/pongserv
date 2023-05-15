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

  async createGameRoom(userId, message: roomOption) {
    const { type, roomName, difficulty, score } = message;
    const room = await this.DbGamesManagerService.createRoomList(
      type,
      roomName,
      difficulty,
      score,
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

  async enterRoom(userId, message) {
    const roomListEntity = await this.DbGamesManagerService.getRoomListByRoomId(
      message.roomId,
    );
    this.createGameDetail(roomListEntity, userId, message.type);
  }

  async getRoomList() {
    const roomList = await this.DbGamesManagerService.getRoomList();
    return roomList;
  }
}
