import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TbGm01LEntity } from './entities/tb-gm-01-l.entity';
import { TbGm01DEntity } from './entities/tb-gm-01-d.entity';
import { TbGm02SEntity } from './entities/tb-gm-02-s.entity';
import { TbGm03DEntity } from './entities/tb-gm-03-d.entity';
import { TbGm04LEntity } from './entities/tb-gm-04-l.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { In } from 'typeorm';
import { networkInterfaces } from 'os';

@Injectable()
export class DbGamesManagerService {
  constructor(
    @InjectRepository(TbGm01LEntity) private Gm01LRp: Repository<TbGm01LEntity>,
    @InjectRepository(TbGm01DEntity) private Gm01DRp: Repository<TbGm01DEntity>,
    @InjectRepository(TbGm02SEntity) private Gm02SRp: Repository<TbGm02SEntity>,
    @InjectRepository(TbGm03DEntity) private Gm03DRp: Repository<TbGm03DEntity>,
    @InjectRepository(TbGm04LEntity) private Gm04LRp: Repository<TbGm04LEntity>,
    @InjectRepository(TbUa01MEntity) private Ua01MRp: Repository<TbUa01MEntity>,
  ) {}

  async createRoomList(type, roomName, difficulty, score, userId) {
    const room = await this.Gm01LRp.save({
      gmRmNm: roomName,
      gmType: type,
      lvDfct: difficulty,
      trgtScr: score,
      delTf: false,
      endType: '04',
      owner: userId,
    });
    return room;
  }

  // Loss Score를 만들어서 바로 가져올 수 있도록
  async createRoomDetail(roomListEntity, userEntity, type) {
    const room = await this.Gm01DRp.save({
      gm01lEntity: roomListEntity,
      ua01mEntity: userEntity,
      getScr: 0,
      lossScr: 0,
      gmRsltCd: '00',
      entryDttm: new Date(),
      delTf: false,
    });
    return room;
  }

  async getRoomListByRoomId(roomId) {
    const room = await this.Gm01LRp.findOne({
      where: { id: roomId },
    });
    return room;
  }

  async getRoomList() {
    const roomList = await this.Gm01LRp.find({
      where: { delTf: false, endType: '04', gmType: '01' },
      select: ['id', 'gmRmNm', 'gmType', 'lvDfct', 'trgtScr', 'owner'],
    });

    const updatedRoomList = await Promise.all(
      roomList.map(async (room) => {
        const ownerImage = await this.Ua01MRp.findOne({
          where: { userId: room.owner },
          select: ['imgPath'],
        });
        return { ...room, ownerImage: ownerImage ? ownerImage.imgPath : null };
      }),
    );
    return updatedRoomList;
  }

  async endGameList(roomListEntity) {
    const room = await this.Gm01LRp.save({
      ...roomListEntity,
      endType: '02',
      gmEndDttm: new Date(),
    });
    return room;
  }

  async startGameList(roomListEntity) {
    const room = await this.Gm01LRp.save({
      ...roomListEntity,
      endType: '01',
      gmStrtDttm: new Date(),
    });
    return room;
  }
  async endGameDetail(roomId) {
    const room = await this.Gm01DRp.update(
      { gm01lEntity: roomId },
      { exitDttm: Date() },
    );
    return room;
  }

  async getUserStatic(userEntity) {
    const user = await this.Gm01DRp.find({
      where: { ua01mEntity: userEntity },
      select: ['gmRsltCd', 'getScr', 'lossScr'], // opUserId
    });
    return user;
  }

  async updateOpponent(roomId, userId, opponentId) {
    const user = await this.Ua01MRp.findOne({
      where: { userId: userId },
    });
    const room = await this.Gm01LRp.findOne({
      where: { id: roomId },
    });

    // console.log(user, room, opponentId);
    const targetColumn = await this.Gm01DRp.findOne({
      where: {
        gm01lEntity: {
          id: room.id,
        },
        ua01mEntity: {
          id: user.id,
        },
      },
    });

    // console.log('UpdateOpponent', targetColumn);
    targetColumn.opUserId = opponentId;
    await this.Gm01DRp.save(targetColumn);
  }

  async updateOpponentList(roomId, opponentId) {
    const room = await this.Gm01LRp.findOne({
      where: { id: roomId },
    });
    room.opUserId = opponentId;
    await this.Gm01LRp.save(room);
  }
  async SaveGame(roomListEntity, userId, result, myScore, opScore) {
    const room = await this.Gm01DRp.findOne({
      where: {
        gm01lEntity: {
          id: roomListEntity.id,
        },
        ua01mEntity: {
          userId: userId,
        },
      },
    });
    room.gmRsltCd = result;
    room.getScr = myScore;
    room.lossScr = opScore;
    room.exitDttm = new Date();
    console.log(room);
    await this.Gm01DRp.save(room);
  }
}
