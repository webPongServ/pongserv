import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { TbCh01LEntity } from 'src/db-manager/db-chats-manager/entities/tb-ch-01-l.entity';
import { ChatroomLeavingDto } from './dto/chatroom-leaving.dto';
import { ChatroomRequestMessageDto } from './dto/chatroom-request-message.dto';
import { ChatroomResponseMessageDto } from './dto/chatroom-response-message.dto';
import { BlockingUserInChatsDto } from './dto/blocking-user-in-chats.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatsService {
  constructor(
    private readonly dbChatsManagerService: DbChatsManagerService,
    private readonly dbUsersManagerService: DbUsersManagerService,
  ) {}

  async createChatroom(
    userId: string,
    chatroomCreationDto: ChatroomCreationDto,
  ) {
    const saltOrRounds = 10; // TODO: Replace to use env
    const name: string = chatroomCreationDto.name;
    const type: string = chatroomCreationDto.type;
    const pwdCryptd: string = await bcrypt.hash(chatroomCreationDto.pwd, saltOrRounds);
    const max: number = chatroomCreationDto.max;
    const newChatroom = await this.dbChatsManagerService.createChatroom(
      name,
      type,
      pwdCryptd,
      max,
    );
    const user = await this.dbUsersManagerService.getUserByUserId(userId);
    await this.dbChatsManagerService.createUserAsOwner(user, newChatroom); // set user as chatroom owner
    return newChatroom.id;
  }

  async takeDmRequest(userId: string, infoDmReq: ChatroomDmReqDto) {
    /*!SECTION
			1. requester와 target에 대한 유저 정보를 가져온다.
				1-1. requester와 target이 같은 유저일 경우에 403 에러를 던진다.
      +. 기존에 동일한 유저에 대한 DM 방이 존재할 경우에, 에러를 던진다.
      ++. requester가 target에게 차단된 상태라면 에러를 던진다.
			2. DM용 private type의 chatroom을 만든다.
			3. requester와 target 모두 DM chatroom의 참여자에 등록한다.
				3-1. requester는 방 참여 여부(chtRmJoinTf)를 true로 설정한다.
				3-2. target의 방 참여 여부는 false로 설정한다.
			4. DM chatroom 정보를 반환한다.
		*/
    // 1
    const requester = await this.dbUsersManagerService.getUserByUserId(userId);
    // 1-1
    if (requester.nickname === infoDmReq.targetNickname) {
      throw new BadRequestException('Self DM not allowed.');
    }
    const trgtUserId = await this.dbUsersManagerService.findUserIdByNickname(
      infoDmReq.targetNickname,
    );
    const target = await this.dbUsersManagerService.getUserByUserId(trgtUserId);
    // +
    if (await this.dbChatsManagerService.getLiveDmRoomOfThisUsers(requester, target))
      throw new BadRequestException(`상대방과의 DM방이 이미 존재합니다.`);
    // ++
    if (await this.dbChatsManagerService.isFrstUserBlockingScndUser(target, requester))
      throw new BadRequestException(`상대방에게 차단된 상태입니다.`);
    // 2
    const nameDmChtrm = '[DM]' + requester.nickname + '->' + target.nickname;
    const newDmChtrm = await this.dbChatsManagerService.createDmChatroom(
      nameDmChtrm,
    );
    // 3
    await this.dbChatsManagerService.setUserToEnterRoom(requester, newDmChtrm);
    const targetInDmInfo = await this.dbChatsManagerService.setUserToEnterRoom(
      target,
      newDmChtrm,
    );
    targetInDmInfo.chtRmJoinTf = false;
    this.dbChatsManagerService.saveChtrmUser(targetInDmInfo);
    // 4
    return newDmChtrm.id;
  }

  async getChatroomsForAUser(userId: any) {
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
        + isAlrdyAttnd
		*/
    // 1
    const user: TbUa01MEntity =
      await this.dbUsersManagerService.getUserByUserId(userId);
    const dmChtrms: TbCh01LEntity[] =
      await this.dbChatsManagerService.getDMChatroomsForUser(user);
    // 2
    const pblAndprtChtrms: TbCh01LEntity[] =
      await this.dbChatsManagerService.getPublicAndProtectedChatrooms();
    // 3
    const combinedChtrms: TbCh01LEntity[] = [...dmChtrms, ...pblAndprtChtrms];
    const results: {
      id: string;
      chatroomName: string;
      ownerNickname: string;
      type: string;
      currentCount: number;
      maxCount: number;
      isAlrdyAttnd: boolean; // TODO - to combine with front-end
    }[] = [];
    for (const eachChtrm of combinedChtrms) {
      const currUserListAndCount =
        await this.dbChatsManagerService.getCurrUserListAndCount(eachChtrm);
      if (currUserListAndCount[1] === 0) continue;
      let owner: TbCh02LEntity = null;
      let isAlrdyAttnd: boolean = false;
      for (const eachUserInChtrm of currUserListAndCount[0]) {
        if (eachUserInChtrm.ua01mEntity.userId === user.userId)
          isAlrdyAttnd = true;
        if (eachUserInChtrm.chtRmAuth === '01')
          owner = eachUserInChtrm;
      }
      results.push({
        id: eachChtrm.id,
        chatroomName: eachChtrm.chtRmNm,
        ownerNickname: owner.ua01mEntity.nickname,
        type: eachChtrm.chtRmType,
        currentCount: currUserListAndCount[1],
        maxCount: eachChtrm.maxUserCnt,
        isAlrdyAttnd: isAlrdyAttnd,
      });
    }
    return results;
  }

  async setUserToEnter(userId: string, infoEntr: ChatroomEntranceDto) {
    /*!SECTION
			1. 해당 uuid를 가진 채팅방을 찾음
			2. 채팅방이 protected일 경우에 비밀번호 검증을 함
			3. DM방일 경우에 유저가 해당 방의 user list에 속해있는지 검증을 함
			4. user가 ban(, kick) 등의 제약이 걸려있는지 확인한다.
      5. 기존에 참여중인지 확인함
        5-1. 참여중이지 않을 경우에 채팅방 인원이 꽉 찼는지 확인함
			6. 유저의 입장 정보를 저장하고 유저의 nickname을 반환한다.
		*/
    // 1
    const targetRoom = await this.dbChatsManagerService.getLiveChtrmById(
      infoEntr.id,
    );
    if (targetRoom === null)
      throw new NotFoundException('The chatroom not exist');
    // 2
    if (targetRoom.chtRmType === '02') {
      // NOTE: hased password가 2rd arg로 들어가야한다.
      const isPwdMatched = await bcrypt.compare(infoEntr.pwd, targetRoom.chtRmPwd); // TODO: Replace to use env
      if (isPwdMatched === false) {
        throw new ForbiddenException('Wrong chatroom password');
      }
    }
    // 3
    const user = await this.dbUsersManagerService.getUserByUserId(userId);
    if (targetRoom.chtRmType === '03') {
      if (
        (await this.dbChatsManagerService.isUserListedInThisChatroom(
          user,
          targetRoom,
        )) === false
      ) {
        throw new ForbiddenException('Not DM chatroom for you');
      }
    }
    // 4
    if (
      (await this.dbChatsManagerService.isUserBannedInARoom(
        user,
        targetRoom,
      )) === true
    ) {
      throw new ForbiddenException("You're banned in the chatroom!");
    }
    // 5
    let isAlreadyIn: boolean = false;
    const liveUserListAndCount: [TbCh02LEntity[], number] =
      await this.dbChatsManagerService.getLiveUserListAndCountInARoom(
        targetRoom,
      );
    for (const eachAttnd of liveUserListAndCount[0]) {
      if (eachAttnd.ua01mEntity.userId === user.userId) {
        isAlreadyIn = true;
        break ;
      }
    }
      // 5-1
    if (isAlreadyIn === false && liveUserListAndCount[1] >= targetRoom.maxUserCnt) {
      throw new ForbiddenException('chatroom user count is full!');
    }
    // 6
    const userInTarget: TbCh02LEntity =
      await this.dbChatsManagerService.setUserToEnterRoom(user, targetRoom);
    if (userInTarget === null)
      throw new InternalServerErrorException('typeorm save error');
    return { userNick: user.nickname, isAlreadyIn: isAlreadyIn };
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
    const targetRoom = await this.dbChatsManagerService.getLiveChtrmById(
      infoEdit.id,
    );
    const userInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(
      user,
      targetRoom,
    );
    if (userInChtrm.chtRmAuth !== '01') {
      throw new UnauthorizedException('Not owner in this room');
    }
    // 2
    const saltOrRounds = 10; // TODO: Replace to use env
    targetRoom.chtRmNm = infoEdit.name;
    targetRoom.chtRmType = infoEdit.type;
    targetRoom.chtRmPwd = await bcrypt.hash(infoEdit.pwd, saltOrRounds);
    targetRoom.maxUserCnt = infoEdit.max;
    await this.dbChatsManagerService.saveChatroom(targetRoom);
    // 3
    return;
  }

  async getLiveUserListInARoom(userId: string, id: string) {
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(id);
    const userListAndCount =
      await this.dbChatsManagerService.getLiveUserListAndCountInARoom(chtrm);
    const results: {
      nickname: string;
      imgPath: string;
      authInChtrm: string;
    }[] = [];
    for (const eachInChtrm of userListAndCount[0]) {
      const eachUser: TbUa01MEntity = eachInChtrm.ua01mEntity;
      results.push({
        nickname: eachUser.nickname,
        imgPath: eachUser.imgPath,
        authInChtrm: eachInChtrm.chtRmAuth,
      });
    }
    return results;
  }

  async processSendingMessage(
    userId: string,
    infoMsg: ChatroomRequestMessageDto,
  ) {
    /*!SECTION
		  1. user 정보를 가져온다.
		  2. user가 chatroom에 있는지 확인한다.
		  3. MUTE 된 상태인지 확인한다.
		  4. 그 유저를 block 한 사람이 있는지 확인한다. // TODO
		  5. 같은 방에 있는 유저들에게 메시지를 보낸다.
		*/
    // 1
    const user = await this.dbUsersManagerService.getUserByUserId(userId);
    // 2
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(infoMsg.id);
    if (chtrm === null) throw new BadRequestException('Not existing chatroom');
    const userInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(
      user,
      chtrm,
    );
    if (userInChtrm === null)
      throw new BadRequestException('Not existing in the chatroom');
    // 3
    if (
      (await this.dbChatsManagerService.isUserMutedInARoom(user, chtrm)) ===
      true
    )
      throw new BadRequestException("You're muted in this room!");
    // 4
    const toSendInChtrm: ChatroomResponseMessageDto = {
      chtrmId: chtrm.id,
      nickname: user.nickname,
      imgPath: user.imgPath,
      msg: infoMsg.msg,
      role: userInChtrm.chtRmAuth,
    };
    return toSendInChtrm;
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
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(
      infoKick.id,
    );
    const requesterInChtrm =
      await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
    if (requesterInChtrm.chtRmJoinTf === false)
      throw new UnauthorizedException('You are not in the chatroom.');
    if (
      requesterInChtrm.chtRmAuth !== '01' &&
      requesterInChtrm.chtRmAuth !== '02'
    )
      throw new UnauthorizedException('You do not have permission.');
    // 2
    const targetUser = await this.dbUsersManagerService.getUserByNickname(
      infoKick.nicknameToKick,
    );
    const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(
      targetUser,
      chtrm,
    );
    // 2-1
    if (targetInChtrm.chtRmJoinTf === false)
      throw new NotFoundException("The target isn't the chatroom");
    // 2-2
    if (targetInChtrm.chtRmAuth === '01')
      throw new ForbiddenException(
        'Are you going to go beyond the power of God?',
      );
    // 3
    await this.dbChatsManagerService.kickUserTransaction(
      targetUser,
      chtrm,
      targetInChtrm,
    );
    // 4
    return targetUser.userId;
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
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(infoBan.id);
    const requesterInChtrm =
      await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
    if (requesterInChtrm.chtRmJoinTf === false)
      throw new UnauthorizedException('You are not in the chatroom.');
    if (
      requesterInChtrm.chtRmAuth !== '01' &&
      requesterInChtrm.chtRmAuth !== '02'
    )
      throw new UnauthorizedException('You do not have permission.');
    // 2
    const targetUser = await this.dbUsersManagerService.getUserByNickname(
      infoBan.nicknameToBan,
    );
    const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(
      targetUser,
      chtrm,
    );
    // 2-1
    if (targetInChtrm.chtRmAuth === '01')
      throw new ForbiddenException(
        'Are you going to go beyond the power of God?',
      );
    // 3
    await this.dbChatsManagerService.banUserTransaction(
      targetUser,
      chtrm,
      targetInChtrm,
    );
    // 4
    return { targetUserId: targetUser.userId, targetNick: targetUser.nickname };
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
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(infoBan.id);
    const requesterInChtrm =
      await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
    if (requesterInChtrm.chtRmJoinTf === false)
      throw new UnauthorizedException('You are not in the chatroom.');
    if (
      requesterInChtrm.chtRmAuth !== '01' &&
      requesterInChtrm.chtRmAuth !== '02'
    )
      throw new UnauthorizedException('You do not have permission.');
    // 2
    const targetUser = await this.dbUsersManagerService.getUserByNickname(
      infoBan.nicknameToMute,
    );
    const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(
      targetUser,
      chtrm,
    );
    // 2-1
    if (targetInChtrm.chtRmJoinTf === false)
      throw new NotFoundException("The target isn't the chatroom");
    // 2-2
    if (targetInChtrm.chtRmAuth === '01')
      throw new ForbiddenException(
        'Are you going to go beyond the power of God?',
      );
    // 3
    await this.dbChatsManagerService.setMuteUserInfo(targetUser, chtrm);
    // 4
    return targetUser.nickname;
  }

  async empowerUser(userId: string, infoEmpwr: ChatroomEmpowermentDto) {
    /*!SECTION
			1. user의 권한이 owner 혹은 administrator 인지 확인한다.
			2. 해당 방의 뮤트할 target의 정보를 확인한다.
				2-1. 해당 방에 존재하는지 체크한다.
				2-2. 타겟이 owner 이면 안 된다.
				2-3. 이미 administrator일 때도 거절한다.
			3. target의 권한을 admin으로 바꾸고 저장한다.
			4. target의 정보를 반환한다.
		*/
    // 1
    const requester = await this.dbUsersManagerService.getUserByUserId(userId);
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(
      infoEmpwr.id,
    );
    const requesterInChtrm =
      await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
    if (requesterInChtrm.chtRmJoinTf === false)
      throw new UnauthorizedException('You are not in the chatroom.');
    if (
      requesterInChtrm.chtRmAuth !== '01' &&
      requesterInChtrm.chtRmAuth !== '02'
    )
      throw new UnauthorizedException('You do not have permission.');
    // 2
    const targetUser = await this.dbUsersManagerService.getUserByNickname(
      infoEmpwr.nicknameToEmpower,
    );
    const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(
      targetUser,
      chtrm,
    );
    // 2-1
    if (targetInChtrm.chtRmJoinTf === false)
      throw new NotFoundException("The target isn't the chatroom");
    // 2-2
    if (targetInChtrm.chtRmAuth === '01')
      throw new ForbiddenException(
        'Are you going to go beyond the power of God?',
      );
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
				// NOTE: 저번 회의 때 Tb_UA02L 테이블에 현재 게임 여부에 대해 정보를 알 수 있다.
				// 하지만 저번에 사용여부에 대해서 이야기 했기 때문에 이번에 확인해봐야 겠다.
			4. game 신청 user와 target 정보를 반환한다.
				// 웹소켓을 통해서 target 유저에게 game request를 보내게 하면 될 듯
		*/
    // 1
    const requester = await this.dbUsersManagerService.getUserByUserId(userId);
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(
      infoGameReq.id,
    );
    const requesterInChtrm =
      await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
    if (requesterInChtrm.chtRmJoinTf === false)
      throw new UnauthorizedException('You are not in the chatroom.');
    // 2
    const target = await this.dbUsersManagerService.getUserByNickname(
      infoGameReq.nicknameToGame,
    );
    const targetInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(
      target,
      chtrm,
    );
    if (targetInChtrm.chtRmJoinTf === false)
      throw new NotFoundException("The target isn't the chatroom");
    // 3
    const currTrgtLgn = await this.dbUsersManagerService.getCurrLoginData(
      target,
    );
    if (currTrgtLgn === null)
      throw new NotFoundException('The target not logined');
    if (currTrgtLgn.stsCd === '03')
      throw new BadRequestException('The target is gaming now.');
    // 4
    return target.userId;
  }

  async getBanListInARoom(userId: string, id: string) {
    /*!SECTION
			1. uuid에 해당하는 chatroom 정보를 가져옴
			2. 해당 chatroom에서 현재 ban으로 등록된 유저 목록을 가져옴
		*/
    // 1
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(id);
    if (chtrm === null)
      throw new NotFoundException("The chatroom isn't exist currently.");
    // 2
    const banList = await this.dbChatsManagerService.getBanListInARoom(chtrm);

    const results: {
      nickname: string;
      imgPath: string;
      authInChtrm: string;
    }[] = [];
    for (const eachBan of banList) {
      const eachUserBanned: TbUa01MEntity = eachBan.ua01mEntity;
      results.push({
        nickname: eachUserBanned.nickname,
        imgPath: eachUserBanned.imgPath,
        authInChtrm: '03', // default: normal
      });
    }
    return results;
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
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(
      infoBanRmv.id,
    );
    const requesterInChtrm =
      await this.dbChatsManagerService.getUserInfoInChatrm(requester, chtrm);
    if (requesterInChtrm.chtRmJoinTf === false)
      throw new UnauthorizedException('You are not in the chatroom.');
    if (
      requesterInChtrm.chtRmAuth !== '01' &&
      requesterInChtrm.chtRmAuth !== '02'
    )
      throw new UnauthorizedException('You do not have permission.');
    // 2
    const target = await this.dbUsersManagerService.getUserByNickname(
      infoBanRmv.nicknameToFree,
    );
    const banInfoOfTarget = await this.dbChatsManagerService.getBanInfoInAChtrm(
      target,
      chtrm,
    );
    // 2-1
    if (banInfoOfTarget === null)
      throw new NotFoundException("The taget isn't in ban list.");
    // 3
    banInfoOfTarget.vldTf = false;
    this.dbChatsManagerService.saveChtrmRstrInfo(banInfoOfTarget);
    return target.nickname;
  }

  async leaveChatroom(userId: string, infoLeav: ChatroomLeavingDto) {
    /*!SECTION
			1. 유저가 채팅방 내에 있는지 확인한다.
			2. 인원이 혼자인 경우
				2-1. chatroom의 존재 여부를 false로 바꾼다.
			3. 인원이 2명 이상인 경우
				3-1. 권한이 owner일 경우에 참여자 중 한명의 권한을 owner로 설정한다.
					3-1-1. admin이 있는 경우에 admin 중 한명으로 설정
					3-1-2. admin이 없는 경우에 나머지 참여자 중 한명으로 설정
				3-2. 나가는 유저의 권한을 normal로 바꾼다.
			4. 채널 참여 여부를 false로 바꾸고 반환한다.
		*/
    const result: {
      leaverNick: string;
      nextOwnerNick: string;
    } = {
      leaverNick: null,
      nextOwnerNick: null,
    };
    // 1
    const user = await this.dbUsersManagerService.getUserByUserId(userId);
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(
      infoLeav.id,
    );
    if (chtrm === null) {
      throw new NotFoundException('The chatroom is not found');
    }
    const userInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(
      user,
      chtrm,
    );
    // NOTE: when not in the room
    // if (userInChtrm === null || userInChtrm.chtRmJoinTf === false) {
    //   throw new NotFoundException("You're not in the chatroom");
    // }
    const [userListInChtrm, countInChtrm]: [TbCh02LEntity[], number] =
      await this.dbChatsManagerService.getLiveUserListAndCountInARoom(chtrm);
    if (countInChtrm === 1) {
      // 2
      // 2-1
      chtrm.chtRmTf = false;
      this.dbChatsManagerService.saveChatroom(chtrm);
    } else if (countInChtrm > 1) {
      // 3
      // 3-1
      if (userInChtrm.chtRmAuth === '01') {
        let sccssrToOwner: TbCh02LEntity = null;
        // 3-1-1
        for (const eachUserInChtrm of userListInChtrm) {
          if (eachUserInChtrm.chtRmAuth === '02') {
            sccssrToOwner = eachUserInChtrm;
            break;
          }
        }
        if (sccssrToOwner === null) {
          // 3-1-2
          for (const eachUserInChtrm of userListInChtrm) {
            if (eachUserInChtrm.chtRmAuth === '03') {
              sccssrToOwner = eachUserInChtrm;
              break;
            }
          }
        }
        sccssrToOwner.chtRmAuth = '01';
        this.dbChatsManagerService.saveChtrmUser(sccssrToOwner);
        result.nextOwnerNick = sccssrToOwner.ua01mEntity.nickname;
      }
      // 3-2
      userInChtrm.chtRmAuth = '03';
    }
    // 4
    userInChtrm.chtRmJoinTf = false;
    this.dbChatsManagerService.saveChtrmUser(userInChtrm);
    result.leaverNick = user.nickname;
    return result;
  }

  async putBlockUserInChats(userId: string, infoBlck: BlockingUserInChatsDto) {
    /*!SECTION
		1. requester user 정보를 가져온다.
		2. target user를 찾아서 가져온다.
		3. boolToBlock 정보에 따라서 TB_CH04L에 등록한다.
	*/
    // 1
    const requester = await this.dbUsersManagerService.getUserByUserId(userId);
    // 2
    const target = await this.dbUsersManagerService.getUserByNickname(
      infoBlck.nickname,
    );
    // 3
    await this.dbChatsManagerService.setBlockingData(
      requester,
      target,
      infoBlck.boolToBlock,
    );
    return;
  }

  async getUserIdsForThisUserToBlock(userId: string) {
    const user = await this.dbUsersManagerService.getUserByUserId(userId);
    const blockingList =
      await this.dbChatsManagerService.getListForThisUserToBlock(user);
    const retUserIdsBlocked: string[] = [];
    for (const each of blockingList) {
      retUserIdsBlocked.push(each.ua01mEntityAsBlock.userId);
    }
    return retUserIdsBlocked;
  }

  async isTargetBlockedByUser(userId: string, targetNickname: string) {
    const requestUser = await this.dbUsersManagerService.getUserByUserId(
      userId,
    );
    const targetUser = await this.dbUsersManagerService.getUserByNickname(
      targetNickname,
    );
    const blockingData = await this.dbChatsManagerService.getBlockingData(
      requestUser,
      targetUser,
    );
    if (!blockingData || blockingData.stCd === '02') {
      return false;
    }
    return true;
  }

  async checkBothUserInSameChtrm(frstUserId: string, scndUserId: string, chtrmId: string) {
    const frstUser = await this.dbUsersManagerService.getUserByUserId(frstUserId);
    const scndUser = await this.dbUsersManagerService.getUserByUserId(scndUserId);
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(chtrmId);
    if (await this.dbChatsManagerService.isUserListedInThisChatroom(frstUser, chtrm) === false
      || await this.dbChatsManagerService.isUserListedInThisChatroom(scndUser, chtrm) === false)
      throw new NotFoundException(`같은 채팅방에 존재하지 않습니다.`);
    return true;
  }
}
