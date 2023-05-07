import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DbChatsManagerService } from 'src/db-manager/db-chats-manager/db-chats-manager.service';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import { TbCh02LEntity } from 'src/db-manager/db-chats-manager/entities/tb-ch-02-l.entity';
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { ChatroomEditingDto } from './dto/chatroom-editing.dto';
import { ChatroomKickingDto } from './dto/chatroom-kicking.dto';
import { ChatroomBanDto } from './dto/chatroom-ban.dto';
import { ChatroomMuteDto } from './dto/chatroom-mute.dto';
import { ChatroomEmpowermentDto } from './dto/chatroom-empowerment.dto';
import { ChatroomGameRequestDto } from './dto/chatroom-game-req.dto';
import { ChatroomBanRemovalDto } from './dto/chatroom-ban-removal.dto';
import { ChatroomDmReqDto } from './dto/chatroom-dm-req.dto';

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

	async takeDmRequest(userId: string, infoDmReq: ChatroomDmReqDto) {
		/*!SECTION
			1. requester와 target에 대한 유저 정보를 가져온다.
			2. DM용 private type의 chatroom을 만든다.
			3. requester와 target 모두 DM chatroom의 참여자에 등록한다.
				3-1. requester는 방 참여 여부(chtRmJoinTf)를 true로 설정한다.
				3-2. target의 방 참여 여부는 false로 설정한다.
			4. DM chatroom 정보를 반환한다.
		*/
		// 1
		const requester = await this.dbUsersManagerService.getUserByUserId(userId);
		const target = await this.dbUsersManagerService.getUserByUserId(infoDmReq.targetUserId); // NOTE: nickname으로 바뀔 가능성 있음 (프론트랑 협의)
		// 2
		const nameDmChtrm = '[DM]' + requester.nickname + '->' + target.nickname;
		const newDmChtrm = await this.dbChatsManagerService.createDmChatroom(nameDmChtrm);
		// 3
		await this.dbChatsManagerService.setUserToEnterRoom(requester, newDmChtrm);
		const targetInDmInfo = await this.dbChatsManagerService.setUserToEnterRoom(target, newDmChtrm);
		targetInDmInfo.chtRmJoinTf = false;
		this.dbChatsManagerService.saveChtrmUser(targetInDmInfo);
		// 4
		return (newDmChtrm.uuid);
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

	async setUserToEnter(userId: string, infoEntr: ChatroomEntranceDto) {
		/*!SECTION
			1. 해당 uuid를 가진 채팅방을 찾음
			2. 채팅방이 protected일 경우에 비밀번호 검증을 함
			3. DM방일 경우에 유저가 해당 방의 user list에 속해있는지 검증을 함
			4. 채팅방 인원이 꽉 찼는지 확인함
			// TODO: user가 ban, kick 등의 제약이 걸려있는지 확인한다.
			5. 조건이 맞을 경우에 chatrooms user list에 추가
			6. 그 방의 유저 리스트 정보를 반환한다.
		*/
		// 1
		const targetRoom = await this.dbChatsManagerService.getLiveChtrmByUuid(infoEntr.uuid);
		if (targetRoom === null)
			throw new NotFoundException('The chatroom not exist');
		// 2
		if (targetRoom.chtRmType === '02') {
			if (targetRoom.chtRmPwd !== infoEntr.pwd) {
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

	async editChatroomInfo(userId: string, infoEdit: ChatroomEditingDto) {
		/*!SECTION
			1. user의 방에 대한 권한을 확인한다.
				1-1. owner가 아닌 경우에는 Exception을 throw 한다.
					(owner의 경우에만 방의 정보를 변경할 수 있음)
			2. 방의 정보를 바꾼다.
			3. (바뀐 방의 정보를 방에 참여한 다른 유저에게 알려야 한다면 websocket gateway에게 요청해서 처리해야 할 듯) // NOTE
		*/
		// 1
		const user = await this.dbUsersManagerService.getUserByUserId(userId);
		const targetRoom = await this.dbChatsManagerService.getLiveChtrmByUuid(infoEdit.uuid);
		const userInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(user, targetRoom);
		if (userInChtrm.chtRmAuth !== '01') {
			throw new UnauthorizedException('Not owner in this room');
		}
		// 2
		targetRoom.chtRmNm = infoEdit.name;
		targetRoom.chtRmType = infoEdit.type;
		targetRoom.chtRmPwd = infoEdit.pwd;
		await this.dbChatsManagerService.saveChatroom(targetRoom);
		// 3 // TODO: to use websocket
		return ;
	}

	async getLiveUserListInARoom(userId: string, uuid: string) {
		// NOTE: userID not used
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(uuid);
		const userListAndCount = await this.dbChatsManagerService.getLiveUserListAndCountInARoom(chtrm);
		return userListAndCount[0];
	}

	async kickUser(userId: string, infoKick: ChatroomKickingDto) {
		/*!SECTION
			1. user의 권한이 owner 혹은 administrator 인지 확인한다.
			2. 해당 방의 강퇴할 target의 정보를 확인한다.
				2-1. 해당 방에 존재하는지 체크한다.
				2-2. 강퇴할 target이 owner 이면 안 된다.
			3. kick transaction 실행 // NOTE: 실제 transaction 적용은 안정화 스프린트에
				3-1. ch02d에 kick user 정보를 등록
				3-2. ch02l의 chtRmJoinTf를 false로 변경
				(하나의 transaction은 DbChatsManagerService에서 하나의 메서드로 관리하는게 좋을 듯)
			4. (websocket을 통해서 채팅방 구성원들에게 정보를 알린다.) // NOTE: 이건 그냥 target 유저 정보를 return 하면 될 듯
		*/
		// 1
		const requester = await this.dbUsersManagerService.getUserByUserId(userId);
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(infoKick.uuid);
		const requesterInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
		if (requesterInChtrm.chtRmJoinTf === false)
			throw new UnauthorizedException('You are not in the chatroom.');
		if (requesterInChtrm.chtRmAuth !== '01' && requesterInChtrm.chtRmAuth !== '02')
			throw new UnauthorizedException('You do not have permission.');
		// 2
		const targetUser = await this.dbUsersManagerService.getUserByUserId(infoKick.userIdToKick);
		const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(targetUser, chtrm);
			// 2-1
		if (targetInChtrm.chtRmJoinTf === false)
			throw new NotFoundException('The target isn\'t the chatroom');
			// 2-2
		if (targetInChtrm.chtRmAuth === '01')
			throw new ForbiddenException('Are you going to go beyond the power of God?');
		// 3
		await this.dbChatsManagerService.kickUserTransaction(targetUser, chtrm, targetInChtrm);
		// 4
		return (targetUser.nickname);
	}

	async banUser(userId: string, infoBan: ChatroomBanDto) {
		/*!SECTION
			1. user의 권한이 owner 혹은 administrator 인지 확인한다.
			2. 해당 방의 밴할 target의 정보를 확인한다.
				2-1. 밴할 target이 owner 이면 안 된다.
			3. ban transaction 실행
				3-1. ch02d에 ban user 정보를 등록
				3-2. ch02l의 chtRmJoinTf를 false로 변경 (자동 강퇴)
			4. target의 정보를 반환
		*/
		// 1
		const requester = await this.dbUsersManagerService.getUserByUserId(userId);
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(infoBan.uuid);
		const requesterInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
		if (requesterInChtrm.chtRmJoinTf === false)
			throw new UnauthorizedException('You are not in the chatroom.');
		if (requesterInChtrm.chtRmAuth !== '01' && requesterInChtrm.chtRmAuth !== '02')
			throw new UnauthorizedException('You do not have permission.');
		// 2
		const targetUser = await this.dbUsersManagerService.getUserByUserId(infoBan.userIdToBan);
		const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(targetUser, chtrm);
			// 2-1
		if (targetInChtrm.chtRmAuth === '01')
			throw new ForbiddenException('Are you going to go beyond the power of God?');
		// 3
		await this.dbChatsManagerService.banUserTransaction(targetUser, chtrm, targetInChtrm);
		// 4
		return (targetUser.nickname);
	}

	async muteUser(userId: string, infoBan: ChatroomMuteDto) {
		/*!SECTION
			1. user의 권한이 owner 혹은 administrator 인지 확인한다.
			2. 해당 방의 뮤트할 target의 정보를 확인한다.
				2-1. 해당 방에 존재하는지 체크한다.
				2-2. 뮤트할 target이 owner 이면 안 된다.
			3. ch02d에 mute user 정보를 등록
			4. target의 정보를 반환
		*/
		// 1
		const requester = await this.dbUsersManagerService.getUserByUserId(userId);
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(infoBan.uuid);
		const requesterInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
		if (requesterInChtrm.chtRmJoinTf === false)
			throw new UnauthorizedException('You are not in the chatroom.');
		if (requesterInChtrm.chtRmAuth !== '01' && requesterInChtrm.chtRmAuth !== '02')
			throw new UnauthorizedException('You do not have permission.');
		// 2
		const targetUser = await this.dbUsersManagerService.getUserByUserId(infoBan.userIdToMute);
		const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(targetUser, chtrm);
			// 2-1
		if (targetInChtrm.chtRmJoinTf === false)
			throw new NotFoundException('The target isn\'t the chatroom');
			// 2-2
		if (targetInChtrm.chtRmAuth === '01')
			throw new ForbiddenException('Are you going to go beyond the power of God?');
		// 3
		await this.dbChatsManagerService.setMuteUserInfo(targetUser, chtrm);
		// 4
		return (targetUser.nickname);
	}

	async empowerUser(userId: string, infoEmpwr: ChatroomEmpowermentDto) {
		/*!SECTION
			1. user의 권한이 owner 혹은 administrator 인지 확인한다.
			2. 해당 방의 뮤트할 target의 정보를 확인한다.
				2-1. 해당 방에 존재하는지 체크한다.
				2-2. 뮤트할 타겟이 owner 이면 안 된다.
				2-3. 이미 administrator일 때도 거절한다.
			3. target의 권한을 admin으로 바꾸고 저장한다.
			4. target의 정보를 반환한다.
		*/
		// 1
		const requester = await this.dbUsersManagerService.getUserByUserId(userId);
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(infoEmpwr.uuid);
		const requesterInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
		if (requesterInChtrm.chtRmJoinTf === false)
			throw new UnauthorizedException('You are not in the chatroom.');
		if (requesterInChtrm.chtRmAuth !== '01' && requesterInChtrm.chtRmAuth !== '02')
			throw new UnauthorizedException('You do not have permission.');
		// 2
		const targetUser = await this.dbUsersManagerService.getUserByUserId(infoEmpwr.userIdToEmpower);
		const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(targetUser, chtrm);
			// 2-1
		if (targetInChtrm.chtRmJoinTf === false)
			throw new NotFoundException('The target isn\'t the chatroom');
			// 2-2
		if (targetInChtrm.chtRmAuth === '01')
			throw new ForbiddenException('Are you going to go beyond the power of God?');
			// 2-3
		if (targetInChtrm.chtRmAuth === '02')
			throw new ForbiddenException('The target is already administrator');
		// 3
		targetInChtrm.chtRmAuth = '02';
		this.dbChatsManagerService.saveChtrmUser(targetInChtrm);
		// 4
		return targetUser.nickname;
	}

	async takeGameRequest(userId: string, infoGameReq: ChatroomGameRequestDto) {
		/*!SECTION
			1. user가 chatroom에 있는지 확인한다.
			2. target 유저가 chatroom에 있는지 확인한다.
			3. target 유저의 현재 로그인 정보를 가져와서 게임 중인지 확인한다.
				// NOTE: 저번 회의 때 Tb_UA02L 테이블에 현재 게임 여부에 대해 정보를 알 수 잇다.
				// 하지만 저번에 사용여부에 대해서 이야기 했기 때문에 이번에 확인해봐야 겠다.
			4. game 신청 user와 target 정보를 반환한다.
				// 웹소켓을 통해서 target 유저에게 game request를 보내게 하면 될 듯
		*/
		// 1
		const requester = await this.dbUsersManagerService.getUserByUserId(userId);
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(infoGameReq.uuid);
		const requesterInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
		if (requesterInChtrm.chtRmJoinTf === false)
			throw new UnauthorizedException('You are not in the chatroom.');
		// 2
		const target = await this.dbUsersManagerService.getUserByUserId(infoGameReq.userIdToGame);
		const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(target, chtrm);
		if (targetInChtrm.chtRmJoinTf === false)
			throw new NotFoundException('The target isn\'t the chatroom');
		// 3
		const currTrgtLgn = await this.dbUsersManagerService.getCurrLoginData(target);
		if (currTrgtLgn === null)
			throw new NotFoundException('The target not logined');
		if (currTrgtLgn.gmTf === true)
			throw new BadRequestException('The target is gaming now.');
		// 4
		return target.userId;
	}

	async getBanListInARoom(userId: string, uuid: string) {
		/*!SECTION
			1. uuid에 해당하는 chatroom 정보를 가져옴
			2. 해당 chatroom에서 현재 ban으로 등록된 유저 목록을 가져옴
		*/
		// 1
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(uuid);
		if (chtrm === null)
			throw new NotFoundException('The chatroom isn\'t exist currently.')
		// 2
		const banList = await this.dbChatsManagerService.getBanListInARoom(chtrm);
		return banList;
	}

	async removeBan(userId: string, infoBanRmv: ChatroomBanRemovalDto) {
		/*!SECTION
			1. user(requester)의 권한을 확인한다. (owner, administrator가 아니면 throw)
			2. target의 chatroom에서의 정보를 확인한다.
				2-1. 현재 ban 상태가 아니라면 throw
			3. ban을 해제하고 저장한다.
		*/
		// 1
		const requester = await this.dbUsersManagerService.getUserByUserId(userId);
		const chtrm = await this.dbChatsManagerService.getLiveChtrmByUuid(infoBanRmv.uuid);
		const requesterInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
		if (requesterInChtrm.chtRmJoinTf === false)
			throw new UnauthorizedException('You are not in the chatroom.');
		if (requesterInChtrm.chtRmAuth !== '01' && requesterInChtrm.chtRmAuth !== '02')
			throw new UnauthorizedException('You do not have permission.');
		// 2
		const target = await this.dbUsersManagerService.getUserByUserId(infoBanRmv.userIdToFree);
		const banInfoOfTarget = await this.dbChatsManagerService.getBanInfoInAChtrm(target, chtrm);
			// 2-1
		if (banInfoOfTarget === null)
			throw new NotFoundException('The taget isn\'t in ban list.');
		// 3
		banInfoOfTarget.vldTf = false;
		this.dbChatsManagerService.saveChtrmRstrInfo(banInfoOfTarget);
		return ;
	}
}
