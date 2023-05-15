import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TbGm01LEntity } from './entities/tb-gm-01-l.entity';
import { TbGm01DEntity } from './entities/tb-gm-01-d.entity';
import { TbGm02SEntity } from './entities/tb-gm-02-s.entity';
import { TbGm03DEntity } from './entities/tb-gm-03-d.entity';
import { TbGm04LEntity } from './entities/tb-gm-04-l.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { In } from 'typeorm';

@Injectable()
export class DbGamesManagerService {
  constructor(
    @InjectRepository(TbGm01LEntity) private Gm01LRp: Repository<TbGm01LEntity>,
    @InjectRepository(TbGm01DEntity) private Gm01DRp: Repository<TbGm01DEntity>,
    @InjectRepository(TbGm02SEntity) private Gm02SRp: Repository<TbGm02SEntity>,
    @InjectRepository(TbGm03DEntity) private Gm03DRp: Repository<TbGm03DEntity>,
    @InjectRepository(TbGm04LEntity) private Gm04LRp: Repository<TbGm04LEntity>,
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

  async createRoomDetail(roomListEntity, userEntity, type) {
    const room = await this.Gm01DRp.save({
      gm01lEntity: roomListEntity,
      gm01dUserEntity: userEntity,
      getScr: 0,
      gmRsltCd: type,
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
      where: { delTf: false, endType: In(['04', '01']) },
      select: ['id', 'gmRmNm', 'gmType', 'lvDfct', 'trgtScr', 'owner'],
    });
    console.log(roomList);
    return roomList;
  }
}
