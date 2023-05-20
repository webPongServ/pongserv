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
import { Logger, UnauthorizedException } from '@nestjs/common';
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

// @UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UsersChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}
  @WebSocketServer()
  server: Server;
  // private logger: Logger = new Logger('ChatsGateway');

  private userIdToSocketIdMap = new Map<string, string>();

  validateAccessToken(socket: Socket): string {
    try {
      const token = socket?.handshake?.headers?.authorization?.split(' ')[1];
      if (!token) throw new UnauthorizedException('No AccessToken');
      const secret = this.config.get('JWT_SECRET');
      const decoded = jwt.verify(token, secret);
      const userId = decoded['userId'];
      return userId;
    } catch (err) {
      console.log(err);
      socket.emit('errorValidateAuth', 'Not validated Access Token');
      return;
    }
  }

  // TODO - to organize
  async handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    const userId = this.validateAccessToken(socket);
    if (!userId) {
      socket.disconnect();
      return;
    }
    /*!SECTION
      1. Login 진행 (정보 DB에 저장)
      2. intraId-socketId map에 상태 저장
      3. Friend user socket room에 등록 - Friend_userId
      4. Block user socket room에 등록 - Block_userId
      5. 해당 유저 전용 friends socket room으로 로그인 알람 보내기
    */
    if (this.userIdToSocketIdMap.get(userId)) {
      socket.emit(`errorAlreadyLogin`, `This connection will be disconnected.`);
      console.log(
        `socket.emit(errorAlreadyLogin, This connection will be disconnected.);`,
      );
      socket.disconnect();
      return;
    }
    // 1
    // console.log(`process login`);
    this.usersService.processLogin(userId);
    // 2
    this.userIdToSocketIdMap.set(userId, socket.id);
    // console.log(`In handleConnection -> this.userIdToSocketIdMap: `);
    // console.log(this.userIdToSocketIdMap);
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
    socket.on('disconnecting', (reason) => {
      this.handleDisconnecting(socket);
    });
  }

  async handleDisconnecting(@ConnectedSocket() socket: Socket) {
    // console.log(`handleDisconnecting!!!`);
    const userId = this.validateAccessToken(socket);
    if (!userId) {
      return;
    }
    /*!SECTION
        1. chatroom에 참여하고 있는 상태였다면, 나가도록 처리하기
          1-1. 유저가 참여하고 있는 채팅방 id 찾기
          1-2. 해당 채팅방에 대한 leaveChatroom 실행
    */
    const entry = Array.from(this.userIdToSocketIdMap.entries()).find(
      ([, socketId]) => socketId === socket.id,
    );
    if (!entry) {
      return;
    }

    // console.log(`socket disconnecting`);
    // console.log(socket.rooms); // Set { ... }

    // 1
    for (const eachRoom of socket.rooms) {
      // 1-1
      if (eachRoom.startsWith('chatroom_')) {
        const parts = eachRoom.split('chatroom_');
        let chtrmId: string = null;
        if (parts.length > 1) chtrmId = parts[1];
        const infoLeav: ChatroomLeavingDto = {
          id: chtrmId,
        };
        // 1-2
        this.leaveChatroom(socket, infoLeav); // await 어케 적용시키지..?
      }
    }

    /*!SECTION
      1. 해당 유저 전용 friends socket room으로 로그아웃 알람 보내기
      2. intraId-socketId map에 상태 제거
      3. logout 진행 (logout 상태로 업데이트)
    */
    // 1
    const nameOfMyRoomForFriends = `friends_of_${userId}`;
    const myProfile = await this.usersService.getProfile(userId);
    socket
      .to(nameOfMyRoomForFriends)
      .emit(`friendStatusLogout`, myProfile.nickname);

    // 2
    // console.log(
    //   `In handleDisconnect before delete -> this.userIdToSocketIdMap: `,
    // );
    // console.log(this.userIdToSocketIdMap);
    this.userIdToSocketIdMap.delete(entry[0]);
    // console.log(
    //   `In handleDisconnect after delete -> this.userIdToSocketIdMap: `,
    // );
    // console.log(this.userIdToSocketIdMap);

    // 3
    // console.log(`process logout`);
    this.usersService.processLogout(userId);
  }

  async notifyGameStartToFriends(userId: string) {
    const myProfile = await this.usersService.getProfile(userId);
    const userSocketId = this.userIdToSocketIdMap.get(userId);
    const userSocket: Socket = this.server.sockets.sockets.get(userSocketId);
    const nameOfMyRoomForFriends = `friends_of_${userId}`;
    userSocket.to(nameOfMyRoomForFriends).emit(`friendStatusGameStart`, myProfile.nickname);
  }

  async notifyGameEndToFriends(userId: string) {
    const myProfile = await this.usersService.getProfile(userId);
    const userSocketId = this.userIdToSocketIdMap.get(userId);
    const userSocket: Socket = this.server.sockets.sockets.get(userSocketId);
    const nameOfMyRoomForFriends = `friends_of_${userId}`;
    userSocket.to(nameOfMyRoomForFriends).emit(`friendStatusGameEnd`, myProfile.nickname);
  }
  
  @SubscribeMessage('chatroomDirectMessage')
  async takeDmRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoDmReq: ChatroomDmReqDto,
  ) {
    const userId = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomDirectMessage]`);
    // console.log(`ChatroomDmReqDto: `);
    // console.log(infoDmReq);
    try {
      const dmChtrmId = await this.chatsService.takeDmRequest(userId, infoDmReq);
      const nameOfChtrmSocketRoom = `chatroom_${dmChtrmId}`;
      socket.join(nameOfChtrmSocketRoom);
      return { chtrmId: dmChtrmId };
    } catch (err) {
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
    console.log(`[${userId}: `, `socket emit - chatroomCreation]`);
    // console.log(`ChatroomCreationDto: `);
    // console.log(infoCrtn);
    try {
      const newChtrmId = await this.chatsService.createChatroom(
        userId,
        infoCrtn,
      );
      const nameOfChtrmSocketRoom = `chatroom_${newChtrmId}`;
      socket.join(nameOfChtrmSocketRoom);
      return { chtrmId: newChtrmId };
    } catch (err) {
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
    console.log(`[${userId}: `, `socket emit - chatroomEntrance]`);
    // console.log(`ChatroomEntranceDto: `);
    // console.log(infoEntr);
    try {
      const nickname = await this.chatsService.setUserToEnter(userId, infoEntr);
      const nameOfChtrmSocketRoom = `chatroom_${infoEntr.id}`;
      socket.join(nameOfChtrmSocketRoom);
      socket.to(nameOfChtrmSocketRoom).emit('chatroomWelcome', nickname);
      return true;
    } catch (err) {
      socket.emit('errorChatroomEntrance', err.response.message);
      return;
    }
  }

  // TODO: mute 상태 체크하고 muted event emit 하기
  @SubscribeMessage('chatroomMessage')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoMsg: ChatroomRequestMessageDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomMessage]`);
    // console.log(`ChatroomRequestMessageDto: `);
    // console.log(infoMsg);
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
      console.log(err);
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
    console.log(`[${userId}: `, `socket emit - chatroomLeaving]`);
    // console.log(`ChatroomLeavingDto: `);
    // console.log(infoLeav);
    try {
      const {
        leaverNick, 
        nextOwnerNick
      } = await this.chatsService.leaveChatroom(userId, infoLeav);
      const nameOfChtrmSocketRoom = `chatroom_${infoLeav.id}`;
      socket.leave(nameOfChtrmSocketRoom);
      socket.to(nameOfChtrmSocketRoom).emit('chatroomLeaving', leaverNick);
      if (nextOwnerNick) {
        socket.to(nameOfChtrmSocketRoom).emit('chatroomAuthChange', 
          { chtrmId: infoLeav.id, nickname: nextOwnerNick, auth: '01' }); // REVIEW: 권한이 바뀐 유저에게 websocket을 이용해서 바뀐 권한을 알려야 한다.
      }
      return true;
    } catch (err) {
      console.log(err);
      socket.emit('errorChatroomLeaving', err.response.message);
    }
  }

  // TODO - to combine with front-end
  @SubscribeMessage('putBlockingUserInChats')
  async putBlockingUserInChats(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoBlck: BlockingUserInChatsDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - putBlockingUserInChats]`);
    // console.log(`BlockingUserInChatsDto: `);
    // console.log(infoBlck);
    try {
      await this.chatsService.putBlockUserInChats(userId, infoBlck);
      const nameOfblockingSocketRoom = `blocking_${infoBlck.nickname}`;
      if (infoBlck.boolToBlock === true)
        socket.join(nameOfblockingSocketRoom);
      else
        socket.leave(nameOfblockingSocketRoom);
      return true;
    } catch (err) {
      console.log(err);
      socket.emit('errorPutBlockingUserInChats', err.response.message);
    }
  }

  // TODO - to combine with front-end - done
  @SubscribeMessage('chatroomKick')
  async kickChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoKick: ChatroomKickingDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomKick]`);
    // console.log(`ChatroomKickingDto: `);
    // console.log(infoKick);
    try {
      const targetUserId = await this.chatsService.kickUser(userId, infoKick);
      // target user의 socket에 kicked 정보 emit
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      
      const nameOfChtrmSocketRoom = `chatroom_${infoKick.id}`;
      // targetSocketId.leave(nameOfChtrmSocketRoom); // TODO - chtrm에 대한 socket room에서 나가지게 하기
      this.server.to(nameOfChtrmSocketRoom).emit('chatroomBeingKicked', 
        { chtrmId: infoKick.id, nicknameKicked: infoKick.nicknameToKick }); // REVIEW - chtrm에 참여한 다른 인원들도 이에 대한 정보 알 수 있도록 emit
      // if (targetSocketId) {
      //   this.server.to(targetSocketId).emit('chatroomBeingKicked', { chtrmId: infoKick.id });
      // }
      return true;
    } catch (err) {
      console.log(err);
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
    console.log(`[${userId}: `, `socket emit - chatroomMute]`);
    // console.log(`ChatroomMuteDto: `);
    // console.log(infoMute);
    try {
      const targetUserId = await this.chatsService.muteUser(userId, infoMute);
      // target user의 socket에 muted 정보 emit
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      // TODO - chtrm에 참여한 다른 인원들도 이에 대한 정보 알 수 있도록 emit
      if (targetSocketId) {
        this.server.to(targetSocketId).emit('chatroomBeingMuted', { chtrmId: infoMute.id });
      }
      return true;
    } catch (err) {
      console.log(err);
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
      const { targetUserId, targetNick } = await this.chatsService.banUser(userId, infoBan);
      const nameOfChtrmSocketRoom = `chatroom_${infoBan.id}`;
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      if (targetSocketId) {
        // TODO - targetSocketId가 해당 chatroom에 대한 socket room을 나가도록 처리
        const targetSocket: Socket = this.server.sockets.sockets.get(targetSocketId); // NOTE: Find socket by socket id
        targetSocket.leave(`chatroom_${infoBan.id}`);
        this.server.to(targetSocketId).emit('chatroomBeingRegisteredBan', { chtrmId: infoBan.id });
      }
      this.server.to(nameOfChtrmSocketRoom).emit('chatroomBeingRegisteredBan', 
        { chtrmId: infoBan.id, nickname: targetNick }); // REVIEW - chtrm에 참여한 다른 인원들도 이에 대한 정보 알 수 있도록 emit
      return true;
    } catch (err) {
      console.log(err);
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
      this.server.to(nameOfChtrmSocketRoom).emit('chatroomBeingRemovedBan', 
        { chtrmId: infoBanRmv.id, nickname: targetNick }); //REVIEW - 다른 유저들에게 이 사실을 알리기
      return true;
    } catch (err) {
      console.log(err);
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
      const targetUserId = await this.chatsService.empowerUser(userId, infoEmpwr);
      // target user의 socket에 empowered 정보 emit
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      // TODO - chtrm에 참여한 다른 인원들도 이에 대한 정보 알 수 있도록 emit
      if (targetSocketId) {
        this.server.to(targetSocketId).emit('chatroomBeingRegisteredBan', { chtrmId: infoEmpwr.id });
      }
      return true;
    } catch (err) {
      console.log(err);
      socket.emit('errorChatroomMute', err.response.message);
    }
  }

  // STUB - chatroomRequestGame socket event
  // TODO - to combine with front-end
  @SubscribeMessage('chatroomRequestGame')
  async requestGameChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoEmpwr: ChatroomEmpowermentDto
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomEmpowerment]`);
    // console.log(`ChatroomEmpowermentDto: `);
    // console.log(infoEmpwr);
    try {
      const targetUserId = await this.chatsService.empowerUser(userId, infoEmpwr);
      // target user의 socket에 empowered 정보 emit
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      if (targetSocketId) {
        this.server.to(targetSocketId).emit('chatroomBeingRegisteredBan', { chtrmId: infoEmpwr.id });
      }
      return true;
    } catch (err) {
      console.log(err);
      socket.emit('errorChatroomMute', err.response.message);
    }
  }

  @SubscribeMessage('test')
  testSocket(@ConnectedSocket() socket: Socket, @MessageBody() msgBody: any) {
    // console.log(`socket: `);
    // console.log(socket);
    console.log(`socket.id: `);
    console.log(socket.id);
    return 'Hello world!';
  }
}
