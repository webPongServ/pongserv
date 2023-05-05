import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TbCh01LEntity } from './entities/tb-ch-01-l.entity';
import { TbCh02LEntity } from './entities/tb-ch-02-l.entity';
import { TbCh02DEntity } from './entities/tb-ch-02-d.entity';
import { TbCh03LEntity } from './entities/tb-ch-03-l.entity';
import { TbCh04LEntity } from './entities/tb-ch-04-l.entity';
import { TbUa01MEntity } from '../db-users-manager/entities/tb-ua-01-m.entity';

@Injectable()
export class DbChatsManagerService {
  constructor(
    @InjectRepository(TbCh01LEntity) private ch01lRp: Repository<TbCh01LEntity>,
	@InjectRepository(TbCh02LEntity) private ch02lRp: Repository<TbCh02LEntity>,
	@InjectRepository(TbCh02DEntity) private ch02dRp: Repository<TbCh02DEntity>,
	@InjectRepository(TbCh03LEntity) private ch03lRp: Repository<TbCh03LEntity>,
	@InjectRepository(TbCh04LEntity) private ch04lRp: Repository<TbCh04LEntity>,
  ) {}

  async createChatroom(name: string, type: string, pwd: string) {
	const newChtrm = this.ch01lRp.create({
		chtRmNm: name,
		chtRmType: type,
		maxUserCnt: 5, // default
		chtRmPwd: pwd,
		chtRmTf: true,
	})
	return (await this.ch01lRp.save(newChtrm));
  }

  // NOTE: TbUa01MEntity 사용 주의! 에러가 난다면 InjectRepository에 추가!
  async createUserAsOwner(user: TbUa01MEntity, chatroom: TbCh01LEntity) {
	const chatroomUser = this.ch02lRp.create({
		ch01lEntity: chatroom,
		ua01mEntity: user,
		chtRmAuth: "01",
		chtRmJoinTf: true,
		entryDttm: new Date(),
		authChgDttm: new Date(),
	})
	return (await this.ch02lRp.save(chatroomUser));
  }
}
