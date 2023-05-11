import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ChatsService } from './chats.service';
import { BadRequestException } from '@nestjs/common';
// import { Socket } from 'dgram';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage('chatroom-entrance')
  async enterChatroom(@CurrentUser() userId: string, 
                      @ConnectedSocket() socket: Socket, 
                      @MessageBody() infoEntr: ChatroomEntranceDto) {
    /*!SECTION
			1. 해당 uuid를 가진 채팅방을 찾음
			2. 채팅방이 protected일 경우에 비밀번호 검증을 함
			3. DM방일 경우에 유저가 해당 방의 user list에 속해있는지 검증을 함
			4. 채팅방 인원이 꽉 찼는지 확인함
			// TODO: user가 ban, kick 등의 제약이 걸려있는지 확인한다.
			5. 조건이 맞을 경우에 chatrooms user list에 추가
			6. 그 방의 유저 리스트 정보를 반환한다.
    */
    console.log(userId);
    console.log(`infoEntr in chatroom-entrance: `);
    console.log(infoEntr);
    const userListInChtrm = await this.chatsService.setUserToEnter(userId, infoEntr);
    if (userListInChtrm === null)
      throw new BadRequestException();
    
    socket.join(infoEntr.id);
    socket.to(infoEntr.id).emit('chatroom-entrance', 'hello', userId);
    // socket.emit('chatroom-entrance', 'hello');
  }

  // chatroom-chatting
  // @SubscribeMessage('chatroom-chatting')
  // async enterChatroom(@CurrentUser() userId: string, 
  //                     @ConnectedSocket() socket: Socket, 
  //                     @MessageBody() infoEntr: ChatroomEntranceDto) {
  //                     }

  // chatroom-leaving

  @SubscribeMessage('test')
  testSocket(@ConnectedSocket() socket: Socket) {
    console.log(`socket.id: `);
    console.log(socket.id);
    console.log(`socket.rooms: `);
    console.log(socket.rooms);
    socket.rooms.forEach((room) => {
      console.log(room);
      console.log(socket.rooms[room]);
    })
    
    console.log('In ws - message');
    return 'Hello world!';
  }
}
