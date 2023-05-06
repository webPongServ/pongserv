import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DbChatsManagerService } from 'src/db-manager/db-chats-manager/db-chats-manager.service';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import { TbCh02LEntity } from 'src/db-manager/db-chats-manager/entities/tb-ch-02-l.entity';
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { ChatroomEditingDto } from './dto/chatroom-editing.dto';

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

	async setUserToEnter(userId: string, chtrmEntr: ChatroomEntranceDto) {
		/*!SECTION
			1. 해당 uuid를 가진 채팅방을 찾음
			2. 채팅방이 protected일 경우에 비밀번호 검증을 함
			3. DM방일 경우에 유저가 해당 방의 user list에 속해있는지 검증을 함
			4. 채팅방 인원이 꽉 찼는지 확인함
			5. 조건이 맞을 경우에 chatrooms user list에 추가
			6. 그 방의 유저 리스트 정보를 반환한다.
		*/
		// 1
		const targetRoom = await this.dbChatsManagerService.getLiveChtrmByUuid(chtrmEntr.uuid);
		if (targetRoom === null)
			throw new NotFoundException('The chatroom not exist');
		// 2
		if (targetRoom.chtRmType === '02') {
			if (targetRoom.chtRmPwd !== chtrmEntr.pwd) {
				throw new ForbiddenException('Wrong chatroom password');
			}
		}
		// 3
		const user = await this.dbUsersManagerService.getUserByUserId(userId);
		if (targetRoom.chtRmType === '03') {
			if (await this.dbChatsManagerService.isUserListedInThisChatroom(user, targetRoom) === false) {
				throw new ForbiddenException('Not DM chatroom for you');
			}
		}
		// 4
		let liveUserListAndCount: [TbCh02LEntity[], number] = 
			await this.dbChatsManagerService.getLiveUserListAndCountInARoom(targetRoom);
		if (liveUserListAndCount[1] >= targetRoom.maxUserCnt) {
			throw new ForbiddenException('chatroom user count is full!');
		}
		// 5
		const userInTarget: TbCh02LEntity = 
			await this.dbChatsManagerService.setUserToEnterRoom(user, targetRoom); //NOTE - save에서 ua01l에 대한 정보를 안 줄 수가 있음. 테스트를 해보고 안 주면 findOne으로 찾아서 다시 뽑아내게 만들어야 할 듯
		// 6
		if (userInTarget === null)
			throw new InternalServerErrorException('typeorm save error');
		liveUserListAndCount[0].push(userInTarget);
		++liveUserListAndCount[1];
		let eachUserInfos: {
			nickname: string,
			chtRmAuth: string,
		}[];
		for (const eachInChtrm of liveUserListAndCount[0]) {
			eachUserInfos.push({
				nickname: eachInChtrm.ua01mEntity.nickname,
				chtRmAuth: eachInChtrm.chtRmAuth,
			})
		}
		return [eachUserInfos, liveUserListAndCount[1]];
	}

	async editChatroomInfo(userId: string, chtrmEdit: ChatroomEditingDto) {
		/*!SECTION
			1. user의 방에 대한 권한을 확인한다.
				1-1. owner가 아닌 경우에는 Exception을 throw 한다.
					(owner의 경우에만 방의 정보를 변경할 수 있음)
			2. 방의 정보를 바꾼다.
			3. (바뀐 방의 정보를 방에 참여한 다른 유저에게 알려야 한다면 websocket gateway에게 요청해서 처리해야 할 듯) // NOTE
		*/
		// 1
		const user = await this.dbUsersManagerService.getUserByUserId(userId);
		const targetRoom = await this.dbChatsManagerService.getLiveChtrmByUuid(chtrmEdit.uuid);
		const userInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(user, targetRoom);
		if (userInChtrm.chtRmAuth !== '01') {
			throw new UnauthorizedException('Not owner in this room');
		}
		// 2
		targetRoom.chtRmNm = chtrmEdit.name;
		targetRoom.chtRmType = chtrmEdit.type;
		targetRoom.chtRmPwd = chtrmEdit.pwd;
		await this.dbChatsManagerService.saveChatroom(targetRoom);
		// 3 // TODO
		return ;
	}

	async getLiveUserListInARoom(userId: string, uuid: string) {
		// NOTE: userID not used
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(uuid);
		const userListAndCount = await this.dbChatsManagerService.getLiveUserListAndCountInARoom(chtrm);
		return userListAndCount[0];
	}
}
