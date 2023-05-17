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
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { ChatsService } from './chats.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ChatroomRequestMessageDto } from './dto/chatroom-request-message.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { ChatroomLeavingDto } from './dto/chatroom-leaving.dto';
import { UsersService } from 'src/users/users.service';
import { BlockingUserInChatsDto } from './dto/blocking-user-in-chats.dto';
import { ChatroomKickingDto } from './dto/chatroom-kicking.dto';
import { ChatroomMuteDto } from './dto/chatroom-mute.dto';
import { ChatroomBanDto } from './dto/chatroom-ban.dto';
import { ChatroomBanRemovalDto } from './dto/chatroom-ban-removal.dto';

// @UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  // TODO - to combine with front-end
  async handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    const userId = this.validateAccessToken(socket);
    if (!userId) {
      socket.disconnect(true);
      return;
    }
    /*!SECTION
      0. intraId-socketId map에 상태 저장
      1. Friend user socket room에 등록 - Friend_userId
      2. Block user socket room에 등록 - Block_userId
      3. 해당 유저 전용 friends socket room으로 로그인 알람 보내기
    */
    // 0
    this.userIdToSocketIdMap.set(userId, socket.id);
    console.log(`In handleConnection -> this.userIdToSocketIdMap: `)
    console.log(this.userIdToSocketIdMap)
    // 1
    const friendList = await this.usersService.getFriendList(userId);
    for (const eachFriend of friendList) {
      const nameOfFriendRoom = `friends_of_${eachFriend.nickname}`;
      socket.join(nameOfFriendRoom);
    }
    // 2
    const blockingNickList = await this.chatsService.getBlockedUserNicknameList(userId);
    for (const eachNick of blockingNickList) {
      const nameOfBlockingRoom = `blocking_${eachNick}`;
      socket.join(nameOfBlockingRoom);
    }
    // 3
    const myProfile = await this.usersService.getProfile(userId);
    const nameOfMyRoomForFriends = `friends_of_${myProfile.nickname}`;
    socket.to(nameOfMyRoomForFriends).emit(`friendStatusLogin`, myProfile.nickname);
  }

  // TODO - to combine with front-end
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const userId = this.validateAccessToken(socket);
    if (!userId) {
      return;
    }
    /*!SECTION
      1. 해당 유저 전용 friends socket room으로 로그아웃 알람 보내기
      2. chatroom에 참여하고 있는 상태였다면, 나가도록 처리하기
        2-1. 유저가 참여하고 있는 채팅방 id 찾기
      3. intraId-socketId map에 상태 제거
    */
    // 1
    const myProfile = await this.usersService.getProfile(userId);
    const nameOfMyRoomForFriends = `friends_of_${myProfile.nickname}`;
    socket.to(nameOfMyRoomForFriends).emit(`friendStatusLogout`, myProfile.nickname);

    // 2
    console.log(`socket.rooms: `)
    console.log(socket.rooms)

    // 3
    console.log(`In handleDisconnect before delete -> this.userIdToSocketIdMap: `)
    console.log(this.userIdToSocketIdMap)
    const entry = Array.from(this.userIdToSocketIdMap.entries()).find(([, socketId]) => socketId === socket.id);
    if (entry) {
      this.userIdToSocketIdMap.delete(entry[0]);
    }
    console.log(`In handleDisconnect after delete -> this.userIdToSocketIdMap: `)
    console.log(this.userIdToSocketIdMap)
    
  }

  @SubscribeMessage('chatroomCreation')
  async createChatroom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoCrtn: ChatroomCreationDto,
  ) {
    const userId = this.validateAccessToken(socket);
    if (!userId) return;
    const newChtrmId = await this.chatsService.createChatroom(userId, infoCrtn);
    socket.join(newChtrmId);
    return { chtrmId: newChtrmId };
  }

  @SubscribeMessage('chatroomEntrance')
  async enterChatroom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoEntr: ChatroomEntranceDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    try {
      const nickname = await this.chatsService.setUserToEnter(userId, infoEntr);
      socket.join(infoEntr.id);
      socket.to(infoEntr.id).emit('chatroomWelcome', nickname);
      return true;
    } catch (err) {
      socket.emit('errorChatroomEntrance', err.response.message);
      return;
    }
  }

  @SubscribeMessage('chatroomMessage')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoMsg: ChatroomRequestMessageDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    try {
      const toSendInChtrm = await this.chatsService.processSendingMessage(
        userId,
        infoMsg,
      );
      socket.to(infoMsg.id).emit('chatroomMessage', toSendInChtrm);
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
    try {
      const nickname = await this.chatsService.leaveChatroom(userId, infoLeav);
      socket.leave(infoLeav.id);
      socket.to(infoLeav.id).emit('chatroomLeaving', nickname);
      // TODO: 권한이 바뀐 유저에게 websocket을 이용해서 바뀐 권한을 알려야 한다.
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
    try {
      await this.chatsService.putBlockUserInChats(userId, infoBlck);
      const nameOfblockingSocketRoom = `blocking_${infoBlck.nickname}`;
      socket.join(nameOfblockingSocketRoom);
      return true;
    } catch (err) {
      console.log(err);
      socket.emit('errorPutBlockingUserInChats', err.response.message);
    }
  }

  // TODO - to combine with front-end
  @SubscribeMessage('chatroomKick')
  async kickChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoKick: ChatroomKickingDto,
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    try {
      const targetUserId = await this.chatsService.kickUser(userId, infoKick);
      // target user의 socket에 kicked 정보 emit
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      if (targetSocketId) {
        this.server.to(targetSocketId).emit('chatroomBeingKicked', { chtrmId: infoKick.id });
      }
      return true;
    } catch (err) {
      console.log(err);
      socket.emit('errorChatroomKick', err.response.message);
    }
  }

  // TODO - to combine with front-end
  @SubscribeMessage('chatroomMute')
  async muteChatroomUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoMute: ChatroomMuteDto
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomMute]`);
    console.log(`ChatroomMuteDto: `);
    console.log(infoMute);
    try {
      const targetUserId = await this.chatsService.muteUser(userId, infoMute);
      // target user의 socket에 muted 정보 emit
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      if (targetSocketId) {
        this.server.to(targetSocketId).emit('chatroomBeingMuted', { chtrmId: infoMute.id });
      }
      return true;
    } catch (err) {
      console.log(err);
      socket.emit('errorChatroomMute', err.response.message);
    }
  }

  // TODO - to combine with front-end
  @SubscribeMessage('chatroomRegisterBan')
  async registerChatroomBan(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoBan: ChatroomBanDto
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomRegisterBan]`);
    console.log(`ChatroomBanDto: `);
    console.log(infoBan);
    try {
      const targetUserId = await this.chatsService.banUser(userId, infoBan);
      // target user의 socket에 baned 정보 emit
      const targetSocketId = this.userIdToSocketIdMap.get(targetUserId);
      if (targetSocketId) {
        this.server.to(targetSocketId).emit('chatroomBeingRegisteredBan', { chtrmId: infoBan.id });
      }
      return true;
    } catch (err) {
      console.log(err);
      socket.emit('errorChatroomMute', err.response.message);
    }
  }

  // TODO - to combine with front-end - 이건 기존 REST API를 그대로 써도 됨
  @SubscribeMessage('chatroomRemovalBan')
  async removalChatroomBan(
    @ConnectedSocket() socket: Socket,
    @MessageBody() infoBanRmv: ChatroomBanRemovalDto
  ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId) return;
    console.log(`[${userId}: `, `socket emit - chatroomRemovalBan]`);
    console.log(`ChatroomBanRemovalDto: `);
    console.log(infoBanRmv);
    try {
      await this.chatsService.removeBan(userId, infoBanRmv);
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
