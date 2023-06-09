import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomEntranceDto } from '../chats/dto/chatroom-entrance.dto';
import { ChatsService } from '../chats/chats.service';
import {
  Inject,
  Logger,
  OnModuleDestroy,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ChatroomRequestMessageDto } from '../chats/dto/chatroom-request-message.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ChatroomCreationDto } from '../chats/dto/chatroom-creation.dto';
import { ChatroomLeavingDto } from '../chats/dto/chatroom-leaving.dto';
import { UsersService } from 'src/users/users.service';
import { BlockingUserInChatsDto } from '../chats/dto/blocking-user-in-chats.dto';
import { ChatroomKickingDto } from '../chats/dto/chatroom-kicking.dto';
import { ChatroomMuteDto } from '../chats/dto/chatroom-mute.dto';
import { ChatroomBanDto } from '../chats/dto/chatroom-ban.dto';
import { ChatroomBanRemovalDto } from '../chats/dto/chatroom-ban-removal.dto';
import { ChatroomEmpowermentDto } from '../chats/dto/chatroom-empowerment.dto';
import { ChatroomDmReqDto } from '../chats/dto/chatroom-dm-req.dto';
import { ChatroomDirectGameRequestDto } from 'src/chats/dto/chatroom-dg-req.dto';
import { GamesGateway } from 'src/games/games.gateway';
import { ChatroomDirectGameResponseDto } from 'src/chats/dto/chatroom-dg-res.dto';

// @UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UsersChatsGateway implements OnGatewayConnection, OnModuleDestroy {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => GamesGateway)) // NOTE - 순환 종속성 솔루션
    private readonly gamesGateway: GamesGateway,
    private readonly config: ConfigService,
  ) {}
  @WebSocketServer()
  server: Server;

  private userIdToSocketIdMap = new Map<string, string>();
  private logger = new Logger('UsersChatsGateway');

  validateAccessToken(socket: Socket): string {
    try {
      const token = socket?.handshake?.headers?.authorization?.split(' ')[1];
      if (!token) throw new UnauthorizedException('No AccessToken');
      const secret = this.config.get('JWT_SECRET');
      const decoded = jwt.verify(token, secret);
      const userId = decoded['userId'];
      return userId;
    } catch (err) {
      this.logger.error(err);
      socket.emit('errorValidateAuth', 'Not validated Access Token');
      return;
    }
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      await this.initUserConnection(socket);
    } catch (err) {
      this.logger.error(err);
      return;
    }
  }

  async initUserConnection(@ConnectedSocket() socket: Socket) {
    const userId = this.validateAccessToken(socket);
    if (!userId) {
      socket.disconnect();
      return;
    }
    /*!SECTION
      0. 기존에 이미 connection을 통해 관리하고 있는 socket id가 있다면 이후에 다른데서 연결 시도하는 socket 차단
      1. Login 진행 (정보 DB에 저장)
      2. intraId-socketId map에 상태 저장
      3. Friend user socket room에 등록 - friends_of_userId
      4. Block user socket room에 등록 - blocking_userId
      5. 해당 유저 전용 friends socket room으로 로그인 알람 보내기
    */
    // 0
    if (this.userIdToSocketIdMap.get(userId)) {
      socket.emit(`errorAlreadyLogin`, `This connection will be disconnected.`);
      this.logger.error(
        `[socket emit - errorAlreadyLogin, This connection will be disconnected]`,
      );
      socket.disconnect();
      return;
    }
    // 1
    this.logger.log(`process login`);
    // this.usersService.processLogin(userId);
    // 2
    this.userIdToSocketIdMap.set(userId, socket.id);
    // 3
    const frndUserIds = await this.usersService.getFriendUserIds(userId);
    for (const eachUserId of frndUserIds) {
      const nameOfFriendRoom = `friends_of_${eachUserId}`;
      socket.join(nameOfFriendRoom);
    }
    // 4
    const blockingUserIds =
      await this.chatsService.getUserIdsForThisUserToBlock(userId);
    for (const eachUserId of blockingUserIds) {
      const nameOfBlockingRoom = `blocking_${eachUserId}`;
      socket.join(nameOfBlockingRoom);
    }
    // 5
    const nameOfMyRoomForFriends = `friends_of_${userId}`;
    const myProfile = await this.usersService.getProfile(userId);
    socket
      .to(nameOfMyRoomForFriends)
      .emit(`friendStatusLogin`, myProfile.nickname);

    // handleDisconnecting
    socket.on('disconnecting', async () => {
      await this.handleDisconnecting(socket);
    });
  }

  async handleDisconnecting(@ConnectedSocket() socket: Socket) {
    // const userId = this.validateAccessToken(socket);
    // if (!userId) {
    //   return;
    // }
    /*!SECTION
      0. 소켓이 map에 entry로 등록되어 있는지 검증
      1. 해당 유저 전용 friends socket room으로 로그아웃 알람 보내기
      2. intraId-socketId map에 상태 제거
      3. logout 진행 (logout 상태로 업데이트)
      4. chatroom에 참여하고 있는 상태였다면, 나가도록 처리하기
        1-1. 유저가 참여하고 있는 채팅방 id 찾기
        1-2. 해당 채팅방에 대한 leaveChatroom 실행
    */
    // 0
    const entry = Array.from(this.userIdToSocketIdMap.entries()).find(
      ([, socketId]) => socketId === socket.id,
    );
    if (!entry) {
      return;
    }
    const userId = entry[0]; // NOTE: use key
    // 1
    const nameOfMyRoomForFriends = `friends_of_${userId}`;
    const myProfile = await this.usersService.getProfile(userId);
    socket
      .to(nameOfMyRoomForFriends)
      .emit(`friendStatusLogout`, myProfile.nickname);
    // 2
    this.userIdToSocketIdMap.delete(entry[0]);
    // 3
    this.logger.log(`process logout`);
    // await this.usersService.processLogout(userId);
    // 4
    // NOTE: leaving chatroom 로직 제거 (logout 시에 chatroom을 나가게 만들면 안 디고 manual하게 버튼을 눌렀을 경우에만 나가게 해야한다.)
    // for (const eachRoom of socket.rooms) {
    //   // 4-1
    //   if (eachRoom.startsWith('chatroom_')) {
    //     const parts = eachRoom.split('chatroom_');
    //     let chtrmId: string = null;
    //     if (parts.length > 1) chtrmId = parts[1];
    //     const infoLeav: ChatroomLeavingDto = {
    //       id: chtrmId,
    //     };
    //     // 4-2
    //     await this.leaveChatroom(socket, infoLeav);
    //   }
    // }
  }

  async onModuleDestroy() {
    await this.cleanup();
  }

  async cleanup() {
    if (this.server) {
      this.logger.log('UserChatGateway Disconnecting');
      await this.server.disconnectSockets();
    } else this.logger.error('Game Socket Server already removed');
  }

  removeMappedUserSocketIfIs(userId: string) {
    const socketId: string = this.userIdToSocketIdMap.get(userId);
    if (socketId) {
      // const socketOfUser = this.server.sockets.sockets.get(socketId);
      // await this.handleDisconnecting(socketOfUser); // NOTE - Can't because socket.id is undefined
      this.userIdToSocketIdMap.delete(userId);
    }
  }

  isSocketOfUserConnected(userId: string) {
    const socketId: string = this.userIdToSocketIdMap.get(userId);
    if (socketId)
      return true;
    else
      return false;
  }

  // TODO: to combine with front-end
  @SubscribeMessage('getFriendList')
  async getFriendList(@ConnectedSocket() socket: Socket) {
    const userId = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[getFriendList] userId: [${userId}]`);
    try {
      const result: {
        userId: string;
        nickname: string;
        imageUrl: string;
        currStat: string;
      }[] = await this.usersService.getFriendList(userId);
      this.logger.log(`[getFriendList] result: ${result.length} Friends`);
      for (const each of result) {
        if (each.currStat !== '02') {
          if (this.isSocketOfUserConnected(each.userId) === true)
            each.currStat = '01';
          else
            each.currStat = '03';
        }
      }
      return result;
    } catch (err) {
      this.logger.error(`[getFriendList] excpt: ${err}`);
      if (err?.response?.message)
        socket.emit('errorGetFriendList', err.response.message);
      return;
    }
  }

  async notifyGameStartToFriends(userId: string) {
    try {
      this.logger.log(`${userId} notify IN GAME to friends`);
      const myProfile = await this.usersService.getProfile(userId);
      const userSocketId = this.userIdToSocketIdMap.get(userId);
      const userSocket: Socket = this.server.sockets.sockets.get(userSocketId);
      if (!userSocket) return;
      const nameOfMyRoomForFriends = `friends_of_${userId}`;
      userSocket
        .to(nameOfMyRoomForFriends)
        .emit(`friendStatusGameStart`, myProfile.nickname);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async notifyGameEndToFriends(userId: string) {
    try {
      const myProfile = await this.usersService.getProfile(userId);
      const userSocketId = this.userIdToSocketIdMap.get(userId);
      const userSocket: Socket = this.server.sockets.sockets.get(userSocketId);
      if (!userSocket) return;
      this.logger.log(`${userId} notify END GAME to friends`);
      const nameOfMyRoomForFriends = `friends_of_${userId}`;
      userSocket
        .to(nameOfMyRoomForFriends)
        .emit(`friendStatusGameEnd`, myProfile.nickname);
    } catch (err) {
      this.logger.log(err);
    }
  }

  @SubscribeMessage('chatroomDirectMessage')
  async takeDmRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoDmReq: ChatroomDmReqDto,
  ) {
    const userId = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[${userId}: `, `socket emit - chatroomDirectMessage]`);
    // this.logger.log(`ChatroomDmReqDto: `);
    // this.logger.log(infoDmReq);
    try {
      const dmChtrmId = await this.chatsService.takeDmRequest(
        userId,
        infoDmReq,
      );
      const nameOfChtrmSocketRoom = `chatroom_${dmChtrmId}`;
      socket.join(nameOfChtrmSocketRoom);
      return { chtrmId: dmChtrmId };
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomDirectMessage', err.response.message);
      return;
    }
  }

  @SubscribeMessage('chatroomCreation')
  async createChatroom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoCrtn: ChatroomCreationDto,
  ) {
    const userId = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[${userId}: `, `socket emit - chatroomCreation]`);
    // this.logger.log(`ChatroomCreationDto: `);
    // this.logger.log(infoCrtn);
    try {
      const newChtrmId = await this.chatsService.createChatroom(
        userId,
        infoCrtn,
      );
      const nameOfChtrmSocketRoom = `chatroom_${newChtrmId}`;
      socket.join(nameOfChtrmSocketRoom);
      return { chtrmId: newChtrmId };
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomEntrance', err.response.message);
      return;
    }
  }

  @SubscribeMessage('chatroomEntrance')
  async enterChatroom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoEntr: ChatroomEntranceDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[${userId}: `, `socket emit - chatroomEntrance]`);
    // this.logger.log(`ChatroomEntranceDto: `);
    // this.logger.log(infoEntr);
    try {
      const { userNick, isAlreadyIn, authInChtrm } = await this.chatsService.setUserToEnter(userId, infoEntr);
      const nameOfChtrmSocketRoom = `chatroom_${infoEntr.id}`;
      socket.join(nameOfChtrmSocketRoom);
      if (isAlreadyIn == false)
        socket.to(nameOfChtrmSocketRoom).emit('chatroomWelcome', userNick);
      return authInChtrm;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomEntrance', err.response.message);
    }
  }

  @SubscribeMessage('chatroomMessage')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoMsg: ChatroomRequestMessageDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[${userId}: `, `socket emit - chatroomMessage]`);
    // this.logger.log(`ChatroomRequestMessageDto: `);
    // this.logger.log(infoMsg);
    try {
      const toSendInChtrm = await this.chatsService.processSendingMessage(
        userId,
        infoMsg,
      );
      const nameOfChtrmSocketRoom = `chatroom_${infoMsg.id}`;
      const nameOfblockedSocketRoom = `blocking_${userId}`; // NOTE: userid 사용
      socket
        .to(nameOfChtrmSocketRoom)
        .except(nameOfblockedSocketRoom)
        .emit('chatroomMessage', toSendInChtrm);
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomMessage', err.response.message);
    }
  }

  @SubscribeMessage('chatroomLeaving')
  async leaveChatroom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoLeav: ChatroomLeavingDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[${userId}: `, `socket emit - chatroomLeaving]`);
    // this.logger.log(`ChatroomLeavingDto: `);
    // this.logger.log(infoLeav);
    try {
      const { leaverNick, nextOwnerNick } =
        await this.chatsService.leaveChatroom(userId, infoLeav);
      const nameOfChtrmSocketRoom = `chatroom_${infoLeav.id}`;
      socket.leave(nameOfChtrmSocketRoom);
      socket.to(nameOfChtrmSocketRoom).emit('chatroomLeaving', leaverNick);
      if (nextOwnerNick) {
        socket.to(nameOfChtrmSocketRoom).emit('chatroomAuthChange', {
          chtrmId: infoLeav.id,
          nickname: nextOwnerNick,
          auth: '01',
        }); // REVIEW: 권한이 바뀐 유저에게 websocket을 이용해서 바뀐 권한을 알려야 한다.
      }
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomLeaving', err.response.message);
    }
  }

  @SubscribeMessage('putBlockingUserInChats')
  async putBlockingUserInChats(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoBlck: BlockingUserInChatsDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[${userId}: `, `socket emit - putBlockingUserInChats]`);
    // this.logger.log(`BlockingUserInChatsDto: `);
    // this.logger.log(infoBlck);
    try {
      const targetUserId = await this.chatsService.putBlockUserInChats(userId, infoBlck);
      const nameOfblockingSocketRoom = `blocking_${targetUserId}`;
      if (infoBlck.boolToBlock === true) socket.join(nameOfblockingSocketRoom);
      else socket.leave(nameOfblockingSocketRoom);
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorPutBlockingUserInChats', err.response.message);
    }
  }

  @SubscribeMessage('chatroomKick')
  async kickChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoKick: ChatroomKickingDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[${userId}: `, `socket emit - chatroomKick]`);
    // this.logger.log(`ChatroomKickingDto: `);
    // this.logger.log(infoKick);
    try {
      const targetUserId = await this.chatsService.kickUser(userId, infoKick);
      // target user의 socket에 kicked 정보 emit
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);

      const nameOfChtrmSocketRoom = `chatroom_${infoKick.id}`;
      const targetSocket = this.server.sockets.sockets.get(targetSocketId);
      this.server.to(nameOfChtrmSocketRoom).emit('chatroomBeingKicked', {
        chtrmId: infoKick.id,
        nickname: infoKick.nicknameToKick,
      }); // REVIEW - chtrm에 참여한 다른 인원들도 이에 대한 정보 알 수 있도록 emit
      targetSocket.leave(nameOfChtrmSocketRoom); // REVIEW - chtrm에 대한 socket room에서 나가지게 하기
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomKick', err.response.message);
    }
  }

  @SubscribeMessage('chatroomMute')
  async muteChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoMute: ChatroomMuteDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    this.logger.log(`[${userId}: `, `socket emit - chatroomMute]`);
    // this.logger.log(`ChatroomMuteDto: `);
    // this.logger.log(infoMute);
    try {
      const targetNick = await this.chatsService.muteUser(userId, infoMute);
      // target user의 socket에 muted 정보 emit
      // const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      // REVIEW - chtrm에 참여한 다른 인원들도 이에 대한 정보 알 수 있도록 emit
      const nameOfChtrmSocketRoom = `chatroom_${infoMute.id}`;
      this.server.to(nameOfChtrmSocketRoom).emit('chatroomBeingMuted', {
        chtrmId: infoMute.id,
        nickname: targetNick,
      }); // TODO: to combine with front-end
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomMute', err.response.message);
    }
  }

  @SubscribeMessage('chatroomRegisterBan')
  async registerChatroomBan(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoBan: ChatroomBanDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomRegisterBan]`);
    // console.log(`ChatroomBanDto: `);
    // console.log(infoBan);
    try {
      const { targetUserId, targetNick } = await this.chatsService.banUser(
        userId,
        infoBan,
      );
      const nameOfChtrmSocketRoom = `chatroom_${infoBan.id}`;
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      this.server.to(nameOfChtrmSocketRoom).emit('chatroomBeingRegisteredBan', {
        chtrmId: infoBan.id,
        nickname: targetNick,
      }); // REVIEW - chtrm에 참여한 다른 인원들도 이에 대한 정보 알 수 있도록 emit
      if (targetSocketId) {
        // TODO - targetSocketId가 해당 chatroom에 대한 socket room을 나가도록 처리
        const targetSocket: Socket =
          this.server.sockets.sockets.get(targetSocketId); // NOTE: Find socket by socket id
        targetSocket.leave(`chatroom_${infoBan.id}`);
      }
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomRegisterBan', err.response.message);
    }
  }

  @SubscribeMessage('chatroomRemovalBan')
  async removalChatroomBan(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoBanRmv: ChatroomBanRemovalDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomRemovalBan]`);
    // console.log(`ChatroomBanRemovalDto: `);
    // console.log(infoBanRmv);
    try {
      const targetNick = await this.chatsService.removeBan(userId, infoBanRmv);
      const nameOfChtrmSocketRoom = `chatroom_${infoBanRmv.id}`;
      this.server.to(nameOfChtrmSocketRoom).emit('chatroomBeingRemovedBan', {
        chtrmId: infoBanRmv.id,
        nickname: targetNick,
      }); //REVIEW - 다른 유저들에게 이 사실을 알리기
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomRemovalBan', err.response.message);
    }
  }

  @SubscribeMessage('chatroomEmpowerment')
  async empowerChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoEmpwr: ChatroomEmpowermentDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomEmpowerment]`);
    // console.log(`ChatroomEmpowermentDto: `);
    // console.log(infoEmpwr);
    try {
      const targetNick = await this.chatsService.empowerUser(userId, infoEmpwr);
      // target user의 socket에 empowered 정보 emit
      // const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      // TODO - chtrm에 참여한 다른 인원들도 이에 대한 정보 알 수 있도록 emit
      const nameOfChtrmSocketRoom = `chatroom_${infoEmpwr.id}`;
      this.server.to(nameOfChtrmSocketRoom).emit('chatroomBeingEmpowered', {
        chtrmId: infoEmpwr.id,
        nickname: targetNick,
      }); // TODO: to combine with front-end
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomEmpowerment', err.response.message);
    }
  }

  // STUB - chatroomRequestGame socket event
  // TODO - to combine with front-end
  @SubscribeMessage('chatroomRequestGame')
  async requestGameChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoDgReq: ChatroomDirectGameRequestDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomRequestGame]`);
    // console.log(`ChatroomEmpowermentDto: `);
    // console.log(infoEmpwr);
    try {
      /*!SECTION
        1. 같은 chatroom에 있는지 검증
        2. gameGateway에 reqDirectGame 요청
        3. target에게 emit
      */
      // this.usersService.getNicknameByUserId(userId);
      const targetUserId = await this.usersService.getUserIdByNickname(
        infoDgReq.targetNickname,
      );
      await this.chatsService.checkBothUserInSameChtrm(
        userId,
        targetUserId,
        infoDgReq.id,
      ); // NOTE: userId, nickname, chtrmId
      const gmRmId = await this.gamesGateway.reqDirectGame(
        userId,
        targetUserId,
      );

      // const requesterNick = await this.usersService.getNicknameByUserId(userId);
      const requesterProfile = await this.usersService.getProfile(userId);
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      if (targetSocketId) {
        this.server.to(targetSocketId).emit('chatroomBeingRequestedGame', {
          gmRmId: gmRmId,
          rqstrNick: requesterProfile.nickname,
          rqstrImg: requesterProfile.imgPath,
        });
      }
      return gmRmId;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomRequestGame', err.response.message);
    }
  }

  @SubscribeMessage('chatroomResponseGame')
  async responseGameChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoDgRes: ChatroomDirectGameResponseDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomResponseGame]`);
    // console.log(`ChatroomEmpowermentDto: `);
    // console.log(infoEmpwr);
    try {
      const requesterUserId = await this.usersService.getUserIdByNickname(
        infoDgRes.rqstrNick,
      );
      await this.gamesGateway.resDirectGame(
        infoDgRes.gmRmId,
        requesterUserId,
        userId,
        infoDgRes.isApprv,
      );
      return true;
    } catch (err) {
      this.logger.error(err);
      if (err?.response?.message)
        socket.emit('errorChatroomResponseGame', err.response.message);
    }
  }

  // @SubscribeMessage('test')
  // testSocket(@ConnectedSocket() socket: Socket, @MessageBody() msgBody: any) {
  //   // console.log(`socket: `);
  //   // console.log(socket);
  //   console.log(`socket.id: `);
  //   console.log(socket.id);
  //   return 'Hello world!';
  // }
}
