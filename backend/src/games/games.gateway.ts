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
    this.logger.log('GameGateway initialized');
  }
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.validateAccessToken(socket);
    this.logger.log(
      `GameGateway handleConnection: ${socket.id} intraId : ${socket.data}`,
    );
    socket.on('disconnecting', (reason) => {
      /*
      1. 만약에 방에 들어와있는 소켓이 끊긴다면
      2. 그 방 안에 있는 인원들에게 endGame보낸다.
      3. 그 방에 있는 인원들을 전부 나가게 한다.
      4. 그 방을 삭제한다.(조건 04로 변경)
      */
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit('endGame'); // 해당 방에 있는 인원에게 게임 끝났음을 알림
          this.server.socketsLeave(room); // 해당 방에 있는 전원 나가기
          this.GamesService.endGame(room);
        }
      }
    });
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
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
    /*
    1. 소켓을 통해서 들어가는 인원이 누구인지 확인한다.
    2. 방상태를 확인해서 1명만 있는지 확인하고, 만약 아니라면 EXCEPTION을 보낸다.
    3. 1명이라면 방에 들어가는 로직을 만든다.(시작은 아님! 들어가기만!)
      - Detail은 여기에서 만들지 않는다. (Detail은 게임 시작할 때 만들어짐)
    */
    const userId = socket.data;
    const inRoom = await this.server.in(message.roomId).fetchSockets();
    if (inRoom.length == 1 && inRoom[0].data == userId) {
      socket.emit('exception', '방장은 게임에 참여할 수 없습니다.');
      this.logger.log('방장은 자신의 게임에 참여할 수 없습니다.');
      return 'NO';
    } else if (inRoom.length == 1) socket.join(message.roomId);
    else {
      socket.emit('exception', '방이 꽉 차서 들어가실 수 없습니다.');
      return 'NO';
    }

    this.logger.log(userId, 'joined', message.roomId);
    return 'OK';
  }

  @SubscribeMessage('cancelEnterance')
  async cancelEnterance(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message,
  ) {
    const userId = socket.data;
    console.log(userId, 'cancel', message.roomId);
    await socket.leave(message.roomId);
    return 'OK';
  }

  @SubscribeMessage('gameRoomFulfilled')
  async gameStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    socket.to(message.roomId).emit('roomOwner'); // 방장에게 방장임을 알려주는 것
    socket.emit('roomGuest');
    this.server.to(message.roomId).emit('gameStart');
    console.log(
      socket.rooms,
      (await this.server.in(message.roomId).fetchSockets()).length,
    );
    const userId = socket.data;
    const roomId = message.roomId;
    const type = message.type;
    await this.GamesService.enterRoom(userId, roomId, type);
    await this.GamesService.updateOpponent(userId, roomId);
    await this.GamesService.startGame(userId, roomId);
    return 'OK';
  }
  // Game Data 요청 받고 보내기

  @SubscribeMessage('inGameReq')
  inGame(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const roomId = message.roomId;
    // {user : owner, data : 350}
    // console.log('in game req', message.data);
    socket.to(roomId).emit('inGameRes', message);
    return 'OK';
  }

  @SubscribeMessage('dodge')
  scoreUpdate(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    this.logger.log('Dodge Game Score Update', message);
    // console.log('Dodge Game Score Update', message);
    // 필요한 데이터 roodId, Score(양쪽 다), userId
    const roomId = message.roomId;
    const myScore = message.myScore;
    const opScore = message.opScore;
    const userId = socket.data;
    this.GamesService.dodgeGame(userId, roomId, myScore, opScore);
    return 'OK';
  }

  @SubscribeMessage('finishGame')
  leaveGameRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    const userId = socket.data;
    const roomId = message.roomId;
    const myScore = message.myScore;
    const opScore = message.opScore;
    this.logger.log('finishgame DATA', userId, roomId, myScore, opScore);
    this.server.socketsLeave(roomId);
    this.GamesService.finishGame(userId, roomId, myScore, opScore);
    this.GamesService.endGame(roomId);
    return 'OK';
  }

  @SubscribeMessage('ladderGame')
  async createLadderRoom(@ConnectedSocket() socket: Socket) {
    /*
    1. 래더 대기열이 있는지 확인한다.
      1-1. 래더 대기열이 비어있다면, 새로운 방을 만들고 대기열 추가
      1-2. 래더 대기열이 있다면, 해당 방에 join 후 대기열 삭제
    2. socket을 통해 프론트에 방이 만들어졌음을 알린다(roomCreated)
    */
    const userId = socket.data;
    if (this.gameQueue.isEmpty()) {
      const message: roomOption = {
        roomName: 'LADDER_GAME',
        difficulty: '02',
        score: 5,
        type: '02', // 래더는 02로 설정,
      };
      const roomList = await this.GamesService.createGameRoom(userId, message);
      await this.GamesService.createGameDetail(roomList, userId, message.type);
      socket.join(roomList.id);
      this.gameQueue.enqueue(roomList.id);
      this.logger.log('Ladder Game Room Created', roomList.id);
      return roomList.id;
    } else {
      const roomId = this.gameQueue.dequeue();
      socket.join(roomId);
      this.logger.log('Ladder Game Room Joined', roomId);
      this.gameStart(socket, { roomId: roomId, type: '02' });
      return roomId;
    }
    return 'OK';
  }
}
