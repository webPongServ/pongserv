import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ChatsService } from './chats.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { DbChatsManagerService } from 'src/db-manager/db-chats-manager/db-chats-manager.service';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { ChatroomRequestMessageDto } from './dto/chatroom-request-message.dto';
import { WsJwtGuard } from 'src/auth/guard/ws.jwt.guard';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

// @UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway 
  // implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
		private readonly dbChatsManagerService: DbChatsManagerService,
		private readonly dbUsersManagerService: DbUsersManagerService,
    private readonly config: ConfigService
    ) {}

  @WebSocketServer()
  server: Server;

  // @UseGuards(JwtAccessTokenGuard)
  @SubscribeMessage('chatroomEntrance')
  async enterChatroom(
    // socket: Socket, payload: any, callback: (data: any) => void
    // @CurrentUser() userId: string, 
    @ConnectedSocket() socket: Socket, 
    @MessageBody() infoEntr: ChatroomEntranceDto,
    ) {
    // let userId;
    const token = socket?.handshake?.headers?.authorization?.split(' ')[1];
    console.log(`token: `);
    console.log(token);
	  const secret = this.config.get('JWT_SECRET');
    const decoded = jwt.verify(token, secret);
    console.log(`decoded: `);
    console.log(decoded);
    console.log(typeof(decoded));
    console.log(decoded['userId']);
    const userId = decoded['userId'];
  
    console.log(`userId: `);
    console.log(userId);
    // console.log(`infoEntr in chatroom-entrance: `);
    // console.log(infoEntr);
    // console.log(`payload: `);
    // console.log(payload);
    const userListInChtrm = await this.chatsService.setUserToEnter(userId, infoEntr);
    if (userListInChtrm === null)
      throw new BadRequestException();
    
    socket.join(infoEntr.id);
    socket.to(infoEntr.id).emit('chatroomEntrance', 'Welcome', userId);
    
    // socket.emit('chatroom-entrance', 'hello');
    return 'handsome';
  }

  // chatroom-chatting
  // @WsJwtGuard(JwtAccessTokenGuard)
  @SubscribeMessage('chatroomMessage')
  async sendMessage(
    // @CurrentUser() userId: string, 
    @ConnectedSocket() socket: Socket, 
    @MessageBody() infoMsg: ChatroomRequestMessageDto) {
      const token = socket?.handshake?.headers?.authorization?.split(' ')[1];
      const secret = this.config.get('JWT_SECRET');
      const decoded = jwt.verify(token, secret);
      let userId = decoded['userId'];
      console.log('In chatroomMessage');
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
    return ;
  }

  // chatroom-leaving

  @SubscribeMessage('test')
  testSocket(@CurrentUser() userId: string, 
             @ConnectedSocket() socket: Socket, 
             @MessageBody() infoEntr: ChatroomEntranceDto) {
    
    // console.log(`socket: `);
    // console.log(socket);
    
    console.log(`socket.id: `);
    console.log(socket.id);

    console.log(`infoEntr: `);
    console.log(infoEntr);

    // console.log(`socket.rooms: `);
    // console.log(socket.rooms);
    // socket.rooms.forEach((room) => {
    //   console.log(room);
    //   console.log(socket.rooms[room]);
    // })
    return 'Hello world!';
  }
}
