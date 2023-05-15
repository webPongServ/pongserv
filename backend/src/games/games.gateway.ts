import { EnterOption } from './dto/enter.dto';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import GameQueue from './dto/gameQue';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GamesService } from './games.service';
import { roomOption } from './dto/roomOption.dto';
import { Console } from 'console';
import { subscribe } from 'diagnostics_channel';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'games',
})
export class GamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('GameGateway');
  private gameQueue = new GameQueue();

  constructor(
    private jwtService: JwtService,
    private GamesService: GamesService,
  ) {
    this.logger.log('GameGateway constructor');
  }
  validateAccessToken(socket: Socket) {
    const bearerToken = socket.handshake.headers['authorization'];
    // Bearer 토큰이 아닌 경우 에러 메시지를 클라이언트에게 보냅니다.
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      socket.emit(
        'exception',
        'invalid Bearer',
        'Invalid token(It is not a bearerToken)',
      );
      socket.disconnect();
      return;
    }
    // Bearer 토큰에서 실제 토큰 부분만 추출합니다.
    const token = bearerToken.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);
      socket.data = payload.userId;
    } catch (e) {
      socket.emit('exception', 'Invalid token(value in token is not valid)');
      socket.disconnect();
    }
  }
  // Event handlers
  afterInit() {
    this.logger.log('GameGateway init is Successful!');
    this.logger.log('length of gameQueue is ' + this.gameQueue.length);
  }
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.validateAccessToken(socket);
    this.logger.log(
      `GameGateway handleConnection: ${socket.id} intraId : ${socket.data}`,
    );
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.validateAccessToken(socket);
    Array.from(socket.rooms).forEach((room) => {
      socket.to(room).emit('gameDisconnected');
    });
    this.logger.log(`GameGateway handleDisconnect: ${socket.id}`);
  }

  // Event listeners

  @SubscribeMessage('createGameRoom')
  async createGameRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: roomOption,
  ) {
    /*
    1. GM01L에 게임 리스트를 제작한다.
    2. GM01D에 유저의 게임 디테일을 제작한다.
    3. socket을 통해 프론트에 방이 만들어졌음을 알린다(roomCreated)
    */
    const userId = socket.data;
    const roomList = await this.GamesService.createGameRoom(userId, message);
    const gameRoomId = await this.GamesService.createGameDetail(
      roomList,
      userId,
      message.type,
    );
    socket.join(roomList.id);
    socket.broadcast.emit(
      'roomCreated',
      message.roomName,
      message.difficulty,
      message.score,
      roomList.id, // Room의 이름
    );
    console.log(roomList.id);
    return roomList.id;
  }

  @SubscribeMessage('enterGameRoom')
  async entranceGameRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: EnterOption,
  ) {
    const userId = socket.data;
    const inRoom = await this.server.in(message.roomId).fetchSockets();
    if (inRoom.length == 1) socket.join(message.roomId);
    else {
      return 'NO';
    }
    await this.GamesService.enterRoom(userId, message);
    // socket.to(message.roomId).emit('gameStart');
    console.log(socket.id);
    console.log(userId, 'joined', message.roomId);
    return 'OK';
  }

  @SubscribeMessage('cancelEnterance')
  cancelEnterance(@ConnectedSocket() socket: Socket, @MessageBody() message) {
    const userId = socket.data;
    console.log(userId, 'cancel', message.roomId);
    socket.leave(message.roomId);
    return 'OK';
  }

  @SubscribeMessage('gameRoomFulfilled')
  async gameStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    this.server.to(message.roomId).emit('gameStart');
    return 'OK';
  }
  // Game Data 요청 받고 보내기

  @SubscribeMessage('inGameReq')
  inGame(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const roomId = message.roomId;
    const data = message.data;
    socket.to(roomId).emit('inGameRes', data);
  }

  @SubscribeMessage('leaveGameRoom')
  leaveGameRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    const userId = socket.data;
    console.log('leaveGameRoom');
  }
}
