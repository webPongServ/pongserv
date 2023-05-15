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
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
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
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.validateAccessToken(socket);

    this.logger.log(
      `GameGateway handleConnection: ${socket.id} intraId : ${socket.data}, ${socket}`,
    );
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.validateAccessToken(socket);
    this.logger.log(
      `GameGateway handleDisconnect: ${socket.id} intraId : ${socket.data}`,
    );
  }
  afterInit() {
    this.logger.log('GameGateway init is Successful!');
    this.logger.log('length of gameQueue is ' + this.gameQueue.length);
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
  entranceGameRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: EnterOption,
  ) {
    const userId = socket.data;
    this.GamesService.enterRoom(userId, message);
    socket.join(message.roomId);
    console.log(userId, 'joined', message.roomId);
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
