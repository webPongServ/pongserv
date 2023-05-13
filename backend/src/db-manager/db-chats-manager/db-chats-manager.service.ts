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

  async createChatroom(name: string, type: string, pwd: string, max: number) {
	const newChtrm = this.ch01lRp.create({
		chtRmNm: name,
		chtRmType: type,
		maxUserCnt: max,
		chtRmPwd: pwd,
		chtRmTf: true,
	})
	return (await this.ch01lRp.save(newChtrm));
  }

  async createDmChatroom(name: string) {
	const newDmChtrm = this.ch01lRp.create({
		chtRmNm: name,
		chtRmType: '03',
		maxUserCnt: 2,
		chtRmTf: true,
	})
	return (await this.ch01lRp.save(newDmChtrm));
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
	let results: TbCh01LEntity[] = []; // NOTE: 초기화 하지 않으면 에러 발생
	let prvChtrms: TbCh01LEntity[] = await this.ch01lRp.find({
		relations: {
			ch02lEntities: true,
		},
		where: {
			chtRmType: '03',
			chtRmTf: true
		}
	});
	for (const prvChtrm of prvChtrms) {
		let canUserSee: boolean = false;
		for (const userOfChtrm of prvChtrm.ch02lEntities) {
			const userOfChtrmWithRel = await this.ch02lRp.findOne({
				relations: {
					ua01mEntity: true,
				},
				// relationLoadStrategy: "query", // NOTE
				where: {
					id: userOfChtrm.id,
				}
			});
			console.log('userOfChtrmWithRel: ');
			console.log(userOfChtrmWithRel);
			if (userOfChtrmWithRel.ua01mEntity.userId === user.userId) {
				canUserSee = true;
				break ;
			}
		}
		if (canUserSee === true)
			results.push(prvChtrm);
	}
	return results;
  }

  async getPublicAndProtectedChatrooms() {
	const results: TbCh01LEntity[] = await this.ch01lRp.find({
		where: {
			// TODO: Search TypeOrm find options In, Any, ArrayContainedBy
			chtRmType: In(['01','02']),
			chtRmTf: true,
		},
		order: {
			lastDttm: "DESC",
		}
	});
	return results;
  }

  // NOTE: uuid가 원인일 수도 있겠다.
  async getCurrUserListAndCount(chatroom: TbCh01LEntity) {
	const currUserListAndCount = await this.ch02lRp.findAndCount({
		relations: {
			ch01lEntity: true,
			ua01mEntity: true,
		},
		relationLoadStrategy: "query",
		where: {
			ch01lEntity: {
				id: chatroom.id,
			},
			chtRmJoinTf: true,
		}
	});
	// const [result, totalCount] = await this.ch02lRp.findAndCount({
	// 	where: (qb: SelectQueryBuilder<TbCh02LEntity>) => {
	// 	  qb.where('ch02l.ch01lEntity.uuid = :chtRmId', { chtRmId: uuid });
	// 	  qb.andWhere('ch02l.chtRmJoinTf = true');
	// 	},
	// 	relations: ['ua01mEntity'],
	// 	order: { ua01mEntity: 'ASC' },
	// 	skip: page * rpp,
	// 	take: rpp,
	//   });
	  
	console.log('chatroom in DbChatsManagerService.getCurrUserListAndCount(): ')
	console.log(chatroom)
	console.log('currUserListAndCount in DbChatsManagerService.getCurrUserListAndCount(): ')
	console.log(currUserListAndCount)
	return currUserListAndCount;
  }

  async getLiveChtrmById(id: string) {
	const result: TbCh01LEntity = await this.ch01lRp.findOne({
		where: {
			id: id,
			chtRmTf: true,
		}
	})
	return result;
  }

  async isUserListedInThisChatroom(user: TbUa01MEntity, room: TbCh01LEntity): Promise<boolean> {
	const result = await this.ch02lRp.findOne({
		relations: {
			ch01lEntity: true,
			ua01mEntity: true,
		},
		where: {
			ch01lEntity: {
				id: room.id,
			},
			ua01mEntity: {
				id: user.id,
			},
		}
	})
	if (result === null)
		return false;
	return true;
  }

  async setUserToEnterRoom(user: TbUa01MEntity, room: TbCh01LEntity) {
	let userInChtrm = await this.ch02lRp.findOne({
		where: {
			ch01lEntity: {
				id: room.id,
			},
			ua01mEntity: {
				id: user.id,
			},
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
	const currCount = await this.ch02lRp.count({
		where: {
			ch01lEntity: {
				id: room.id,
			},
			chtRmJoinTf: true,
		}
	})
	if (currCount === 0)
		userInChtrm.chtRmAuth = '01';
	userInChtrm.chtRmJoinTf = true;
	userInChtrm.entryDttm = new Date();
	userInChtrm.authChgDttm = new Date();
	return (await this.ch02lRp.save(userInChtrm));
  }

  async getLiveUserListAndCountInARoom(room: TbCh01LEntity) {
	const result = await this.ch02lRp.findAndCount({
		relations: {
			ua01mEntity: true,
		},
		loadRelationIds: true,
		relationLoadStrategy: "query",
		where: {
			ch01lEntity: {
				id: room.id,
			},
			chtRmJoinTf: true,
		}
	});
	console.log(`result in getLiveUserListAndCountInARoom: `);
	console.log(result);
	return result;
  }

  async getUserInfoInChatrm(user: TbUa01MEntity, room: TbCh01LEntity) {
	const result = await this.ch02lRp.findOne({
		// relations: {
		// 	ua01mEntity: true,
		// 	ch01lEntity: true,
		// },
		where: {
			ua01mEntity: {
				id: user.id,
			},
			ch01lEntity: {
				id: room.id,
			},
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
		relations: {
			ch01lEntity: true,
			ua01mEntity: true, 
		},
		where: {
			ch01lEntity: {
				id: room.id,
			},
			ua01mEntity: {
				id: target.id,
			},
			chtRmRstrCd: '03', // KICK: 03
		}
	});
	if (kickInfo === null) {
		kickInfo = this.ch02dRp.create({
			ch01lEntity: room,
			ua01mEntity: target,
			chtRmRstrCd: '03',
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

  async banUserTransaction(target: TbUa01MEntity, room: TbCh01LEntity, targetInChtrm: TbCh02LEntity) {
	/*!SECTION
		1. ch02d에 ban user 정보를 등록
		2. ch02l의 chtRmJoinTf를 false로 변경
	*/
	// 1
	let bandInfo = await this.ch02dRp.findOne({
		relations: {
			ch01lEntity: true,
			ua01mEntity: true, 
		},
		where: {
			ch01lEntity: {
				id: room.id,
			},
			ua01mEntity: {
				id: target.id,
			},
			chtRmRstrCd: '02', // BAN: 02
		}
	});
	if (bandInfo === null) {
		bandInfo = this.ch02dRp.create({
			ch01lEntity: room,
			ua01mEntity: target,
			chtRmRstrCd: '02',
			// rstrCrtnDttm: new Date(),
			// rstrTm: -1, // NOTE: tmp - '-1' means infinity
			// vldTf: true,
		});
	}
	bandInfo.rstrCrtnDttm = new Date();
	bandInfo.rstrTm = -1;
	bandInfo.vldTf = true;
	this.ch02dRp.save(bandInfo);
	// 2
	if (targetInChtrm.chtRmAuth === '02') {
		targetInChtrm.chtRmAuth = '03';
		targetInChtrm.authChgDttm = new Date();
	}
	targetInChtrm.chtRmJoinTf = false;
	this.ch02lRp.save(targetInChtrm);
	return ;
  }

  async setMuteUserInfo(target: TbUa01MEntity, room: TbCh01LEntity) {
	let muteInfo = await this.ch02dRp.findOne({
		relations: {
			ch01lEntity: true,
			ua01mEntity: true, 
		},
		where: {
			ch01lEntity: {
				id: room.id,
			},
			ua01mEntity: {
				id: target.id,
			},
			chtRmRstrCd: '01', // MUTE: 01
		}
	})
	if (muteInfo === null) {
		muteInfo = this.ch02dRp.create({
			ch01lEntity: room,
			ua01mEntity: target,
			chtRmRstrCd: '01',
			// rstrCrtnDttm: new Date(),
			// rstrTm: 60, // NOTE: tmp - 60s
			// vldTf: true,
		});
	}
	muteInfo.rstrCrtnDttm = new Date();
	muteInfo.rstrTm = 60;
	muteInfo.vldTf = true;
	this.ch02dRp.save(muteInfo);
	return ;
  }

  saveChtrmUser(chtrmUser: TbCh02LEntity) {
	this.ch02lRp.save(chtrmUser);
  }

  async getBanListInARoom(room: TbCh01LEntity) {
	const results = await this.ch02dRp.find({
		relations: {
			ch01lEntity: true,
		},
		// relationLoadStrategy: "query",
		where: {
			ch01lEntity: {
				id: room.id,
			},
			chtRmRstrCd: '02',
			vldTf: true,
		}
	})
	return results;
  }

  async getBanInfoInAChtrm(user: TbUa01MEntity, room: TbCh01LEntity) {
	const result = await this.ch02dRp.findOne({
		loadRelationIds: true, // NOTE: To check
		where: {
			ch01lEntity: {
				id: room.id,
			},
			ua01mEntity: {
				id: user.id,
			},
			chtRmRstrCd: '02',
			vldTf: true,
		}
	})
	return result;
  }

  saveChtrmRstrInfo(rstrInfo: TbCh02DEntity) {
	this.ch02dRp.save(rstrInfo);
  }

  async isUserBannedInARoom(user: TbUa01MEntity, room: TbCh01LEntity) {
	const bannedUserInfo = await this.ch02dRp.findOne({
		where: {
			ua01mEntity: {
				id: user.id,
			},
			ch01lEntity: {
				id: room.id,
			},
			chtRmRstrCd: '02',
			vldTf: true,
		}
	});
	if (bannedUserInfo === null)
		return false;
	return true;
  }

  async isUserMutedInARoom(user: TbUa01MEntity, room: TbCh01LEntity) {
	const mutedUserInfo = await this.ch02dRp.findOne({
		where: {
			ua01mEntity: {
				id: user.id,
			},
			ch01lEntity: {
				id: room.id,
			},
			chtRmRstrCd: '01',
			vldTf: true,
		}
	});
	if (mutedUserInfo === null) {
		return false;
	}
	const crtnDttm = mutedUserInfo.rstrCrtnDttm;
	const rstrTmMillis = mutedUserInfo.rstrTm * 1000;
	const dueRstrDttmMillis = crtnDttm.getTime() + rstrTmMillis;
	if (dueRstrDttmMillis < new Date().getTime()) {
		mutedUserInfo.vldTf = false;
		this.ch02dRp.save(mutedUserInfo);
		return false;
	}
	return true;
  }

}
