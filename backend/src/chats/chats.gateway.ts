import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { ChatsService } from './chats.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { DbChatsManagerService } from 'src/db-manager/db-chats-manager/db-chats-manager.service';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { ChatroomRequestMessageDto } from './dto/chatroom-request-message.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { ChatroomLeavingDto } from './dto/chatroom-leaving.dto';
import { UsersService } from 'src/users/users.service';

// @UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway
 implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService
    ) {}
  @WebSocketServer()
  server: Server;
  // private logger: Logger = new Logger('ChatsGateway');

  validateAccessToken(socket: Socket): string {
    try {
      const token = socket?.handshake?.headers?.authorization?.split(' ')[1];
      if (!token)
        throw new UnauthorizedException('No AccessToken');
      const secret = this.config.get('JWT_SECRET');
      const decoded = jwt.verify(token, secret);
      const userId = decoded['userId'];
      return userId;
    } catch (err) {
      console.log(err);
      socket.emit('errorValidateAuth', 'Not validated Access Token');
      return ;
    }
  }

  async handleConnection(
    @ConnectedSocket() socket: Socket, ...args: any[]) {
    const userId = this.validateAccessToken(socket);
    if (!userId) {
      socket.disconnect(true);
      return ;
    }
    /*!SECTION
      1. Friend user socket room에 등록 - Friend_userId
      2. Block user socket room에 등록 - Block_userId
      3. 자신의 userId로 등록된 socket room으로 알람 보내기
    */
    // 1
    const friendList = await this.usersService.getFriendList(userId);
    for (const eachFriend of friendList) {
      const nameOfFriendRoom = `friends_of_${eachFriend.nickname}`;
      socket.join(nameOfFriendRoom);
    }
    // 2

    // 3
    const myProfile = await this.usersService.getProfile(userId);
    const nameOfMyRoomForFriends = `friends_of_${myProfile.nickname}`;
    socket.to(nameOfMyRoomForFriends).emit(`friendOn`, myProfile.nickname);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`client: `)
    console.log(client)
  }

  @SubscribeMessage('chatroomCreation')
  async createChatroom(
    @ConnectedSocket() socket: Socket, 
    @MessageBody() infoCrtn: ChatroomCreationDto
    ) {
    const userId = this.validateAccessToken(socket);
    if (!userId)
      return ;
    const newChtrmId = await this.chatsService.createChatroom(userId, infoCrtn)
    socket.join(newChtrmId);
    return { chtrmId: newChtrmId };
  }

  @SubscribeMessage('chatroomEntrance')
  async enterChatroom(
    @ConnectedSocket() socket: Socket, 
    @MessageBody() infoEntr: ChatroomEntranceDto
    ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId)
      return ;
    try {
      const nickname = await this.chatsService.setUserToEnter(userId, infoEntr);
      socket.join(infoEntr.id);
      socket.to(infoEntr.id).emit('chatroomWelcome', nickname);
      return true;
    } catch (err) {
      socket.emit('errorChatroomEntrance', err.response.message);
      return ;
    }
  }

  @SubscribeMessage('chatroomMessage')
  async sendMessage(
    @ConnectedSocket() socket: Socket, 
    @MessageBody() infoMsg: ChatroomRequestMessageDto
    ) {
    const userId: string = this.validateAccessToken(socket);
    if (!userId)
      return ;
    try {
      const toSendInChtrm = await this.chatsService.processSendingMessage(userId, infoMsg);
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
    if (!userId)
      return ;
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

  @SubscribeMessage('test')
  testSocket(
    @ConnectedSocket() socket: Socket, 
    @MessageBody() msgBody: any
    ) {
    // console.log(`socket: `);
    // console.log(socket);
    console.log(`socket.id: `);
    console.log(socket.id);
    return 'Hello world!';
  }
}
