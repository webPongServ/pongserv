import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async getDMChatroomsForUser(user: TbUa01MEntity) {
	/*!SECTION
		조건은 아래와 같다.
		TbCh01LEntity
			chtRmType: 03 (private)
			chtRmTf: true
		TbCh02LEntity
			ch01lEntity: 해당 방
			ua01mEntity: 해당 유저
		
		참고: DM일 경우에는 DM 신청을 받은 상대방은 채팅방에 참여하지 않아도
		chatroom user list table에 등록이 된다.
		다만 delTf가 true로 초기에 설정됨.
	*/
	let results: TbCh01LEntity[];
	let prvChtrms: TbCh01LEntity[] = await this.ch01lRp.find({
		relations: {
			ch02lEntities: true,
		},
		where: {
			chtRmType: '03',
			chtRmTf: true
		}
	});
	// NOTE: TypeOrm 기능에 좀 더 눈이 밝았다면 forEach를 남발하지 않았을텐데...
	prvChtrms.forEach((prvChtrm) => {
		prvChtrm.ch02lEntities.forEach((userOfChtrm) => {
			if (userOfChtrm.ua01mEntity === user) {
				results.push(prvChtrm);
			}
		})
	})
	return results;
  }

  async getPublicAndProtectedChatrooms() {
	const results: TbCh01LEntity[] = await this.ch01lRp.find({
		where: {
			// TODO: Search TypeOrm find options In, Any, ArrayContainedBy
			chtRmType: In(['01','02']),
			chtRmTf: true,
		}
	});
	return results;
  }

  async getCurrUserListAndCount(chatroom: TbCh01LEntity) {
	const currUserListAndCount = await this.ch02lRp.findAndCount({
		relations: {
			ua01mEntity: true,
		},
		where: {
			ch01lEntity: chatroom,
			chtRmJoinTf: true,
		}
	});
	return currUserListAndCount;
  }

  async getLiveChtrmByUuid(uuid: string) {
	const result: TbCh01LEntity = await this.ch01lRp.findOne({
		where: {
			uuid: uuid,
			chtRmTf: true,
		}
	})
	return result;
  }

  async isUserListedInThisChatroom(user: TbUa01MEntity, room: TbCh01LEntity): Promise<boolean> {
	const result = await this.ch02lRp.findOne({
		where: {
			ch01lEntity: room,
			ua01mEntity: user,
		}
	})
	if (result === null)
		return false;
	return true;
  }

  async setUserToEnterRoom(user: TbUa01MEntity, room: TbCh01LEntity) {
	let userInChtrm = await this.ch02lRp.findOne({
		where: {
			ch01lEntity: room,
			ua01mEntity: user,
		}
	});
	if (userInChtrm === null) {
		userInChtrm = this.ch02lRp.create({
			ch01lEntity: room,
			ua01mEntity: user,
			chtRmAuth: '03',
			chtRmJoinTf: true,
		});
	}
	userInChtrm.entryDttm = new Date();
	userInChtrm.authChgDttm = new Date();
	return (await this.ch02lRp.save(userInChtrm));
  }

  async getLiveUserListAndCountInARoom(room: TbCh01LEntity) {
	const result = await this.ch02lRp.findAndCount({
		relations: {
			ua01mEntity: true,
		},
		where: {
			ch01lEntity: room,
			chtRmJoinTf: true,
		}
	})
	return result;
  }

  async getUserInfoInChatrm(user: TbUa01MEntity, room: TbCh01LEntity) {
	const result = await this.ch02lRp.findOne({
		where: {
			ua01mEntity: user,
			ch01lEntity: room,
		}
	})
	return result;
  }

  async saveChatroom(room: TbCh01LEntity) {
	return (await this.ch01lRp.save(room));
  }

  async kickUserTransaction(target: TbUa01MEntity, room: TbCh01LEntity, targetInChtrm: TbCh02LEntity) {
	/*!SECTION
		1. ch02d에 kick user 정보를 등록
		2. ch02l의 chtRmJoinTf를 false로 변경
	*/
	// 1
	let kickInfo = await this.ch02dRp.findOne({
		where: {
			ch01lEntity: room,
			ua01mEntity: target,
			chtRmRstrCd: '03',
		}
	});
	if (kickInfo === null) {
		kickInfo = this.ch02dRp.create({
			ch01lEntity: room,
			ua01mEntity: target,
			chtRmRstrCd: '03', // KICK: 03
			// rstrCrtnDttm: new Date(),
			// rstrTm: 60, // NOTE: tmp - 60s
			// vldTf: true,
		});
	}
	kickInfo.rstrCrtnDttm = new Date();
	kickInfo.rstrTm = 60;
	kickInfo.vldTf = true;
	this.ch02dRp.save(kickInfo);
	// 2
	if (targetInChtrm.chtRmAuth === '02') {
		targetInChtrm.chtRmAuth = '03';
		targetInChtrm.authChgDttm = new Date();
	}
	targetInChtrm.chtRmJoinTf = false;
	this.ch02lRp.save(targetInChtrm);
	return ;
  }
  
}
