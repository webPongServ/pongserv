import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { ChatsService } from './chats.service';
import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DbChatsManagerService } from 'src/db-manager/db-chats-manager/db-chats-manager.service';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { ChatroomRequestMessageDto } from './dto/chatroom-request-message.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { ChatroomLeavingDto } from './dto/chatroom-leaving.dto';

// @UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway {
  constructor(
    private readonly chatsService: ChatsService,
		private readonly dbChatsManagerService: DbChatsManagerService,
		private readonly dbUsersManagerService: DbUsersManagerService,
    private readonly config: ConfigService
    ) {}

  @WebSocketServer()
  server: Server;

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
      // TODO: err 받아서 errorChatroomEntrance event로 error message 보내기
      // socket.emit('errorChatroomFull', err.response.message);
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
      // socket.emit('errorChatroomMessage', err.response.message); // TODO: use this
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
      return true;
    } catch (err) {
      console.log(err);
      // socket.emit('errorChatroomLeaving', err.response.message); // TODO: use this
    }
  }

  @SubscribeMessage('test')
  testSocket(
    // @CurrentUser() userId: string, 
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
