import { Injectable } from '@nestjs/common';
import { DbChatsManagerService } from 'src/db-manager/db-chats-manager/db-chats-manager.service';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import { TbCh02LEntity } from 'src/db-manager/db-chats-manager/entities/tb-ch-02-l.entity';

@Injectable()
export class ChatsService {
	constructor(
		private readonly dbChatsManagerService: DbChatsManagerService,
		private readonly dbUsersManagerService: DbUsersManagerService
	) {}

	async createChatroom(userId: string, chatroomCreationDto: ChatroomCreationDto) {
		const name: string = chatroomCreationDto.name;
		const type: string = chatroomCreationDto.type;
		const pwd: string = chatroomCreationDto.pwd;
		const newChatroom = await this.dbChatsManagerService.createChatroom(name, type, pwd);
		const user = await this.dbUsersManagerService.getUserByUserId(userId);
		await this.dbChatsManagerService.createUserAsOwner(user, newChatroom); // set user as chatroom owner
		return (newChatroom.uuid);
	}

	async getChatroomsForAUser(userId: string) {
		/*!SECTION
			특정 유저에게 보이는 채팅방 조건은 다음과 같다.
			1. public type
			2. protected type
			3. 해당 유저에 대한 DM (private type)
			
			위의 조건에 해당하는 chatroom list를 얻기 위한 전략은 다음과 같다.
			1. 해당 유저에 해당하는 DM chatroom list 가져오기
			2. public, protected type에 현재 존재하는 chatroom list 가져오기
			3. 얻은 모든 chatroom 리스트에서 프론트에 건네줄 정보들만 추출해서 object list를 만들어서 반환
				uuid, name, owner, type, current, max
		*/
		// 1
		const user: TbUa01MEntity = await this.dbUsersManagerService.getUserByUserId(userId);
		let dmChtrms = await this.dbChatsManagerService.getDMChatroomsForUser(user);
		// 2
		let pblAndprtChtrms = await this.dbChatsManagerService.getPublicAndProtectedChatrooms();
		// 3
		const combinedChtrms = [...dmChtrms, ...pblAndprtChtrms];
		let results: {
			uuid: string,
			chatroomName: string,
			ownerNickname: string,
			type: string,
			currentCount: number,
			maxCount: number,
		}[];
		for (const eachChtrm of combinedChtrms) {
			const currUserListAndCount = await this.dbChatsManagerService.getCurrUserListAndCount(eachChtrm);
			let owner: TbCh02LEntity;
			for (const eachUser of currUserListAndCount[0]) {
				if (eachUser.chtRmAuth === '01') {
					owner = eachUser;
					break ;
				}
			}
			results.push({
				uuid: eachChtrm.uuid,
				chatroomName: eachChtrm.chtRmNm,
				ownerNickname: owner.ua01mEntity.nickname,
				type: eachChtrm.chtRmType,
				currentCount: currUserListAndCount[1],
				maxCount: eachChtrm.maxUserCnt,
			})
		}
		return results;
	}
}
