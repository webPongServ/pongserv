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
      socket.emit('errorChatroomFull', err.response.message);
      // socket.emit('errorChatroomEntrance', err.response.message); // TODO: use this
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
    // TODO: to move in ChatsService
    /*!SECTION
      1. user 정보를 가져온다.
      2. user가 chatroom에 있는지 확인한다.
      3. 그 유저를 block 한 사람이 있는지 확인한다. // TODO
      4. 같은 방에 있는 유저들에게 메시지를 보낸다.
    */
    // nickname, imgUrl, msg, role
    // 1
    const user = await this.dbUsersManagerService.getUserByUserId(userId);
    // 2
    const chtrm = await this.dbChatsManagerService.getLiveChtrmById(infoMsg.id);
    const userInChtrm = await this.dbChatsManagerService.getUserInfoInChatrm(user, chtrm);
    if (userInChtrm === null)
      throw new BadRequestException('Not existing in the chatroom');
    // 3
    
    // 4
    // ChatroomResponseMessageDto
    let toSendInChtrm: {
      chtrmId: string,
      nickname: string,
      imgPath: string,
      msg: string,
      role: string,
    } = null;
    toSendInChtrm = {
      chtrmId: chtrm.id,
      nickname: user.nickname,
      imgPath: user.imgPath,
      msg: infoMsg.msg,
      role: userInChtrm.chtRmAuth,
    };
    socket.to(infoMsg.id).emit('chatroomMessage', toSendInChtrm);
    // this.server.emit('chatroomMessage', toSendInChtrm);
    return true;
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
