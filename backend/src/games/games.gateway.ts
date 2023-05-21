import { EnterOption } from './dto/enter.dto';
import { Inject, Logger, forwardRef, OnModuleDestroy } from '@nestjs/common';
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
import { UsersChatsGateway } from 'src/users-chats-socket/users-chats.gateway';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'games',
})
export class GamesGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleDestroy
{
  @WebSocketServer()
  server: Server;

  private GameSocketId = new Map<string, string>();
  private logger = new Logger('GameGateway');
  private gameQueue = new GameQueue();

  constructor(
    private jwtService: JwtService,
    private GamesService: GamesService,
    @Inject(forwardRef(() => UsersChatsGateway)) // NOTE - 순환 종속성 솔루션
    private UsersChatsGateway: UsersChatsGateway,
  ) {}

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
  async onModuleDestroy() {
    await this.cleanup();
  }

  async cleanup() {
    if (this.server) {
      this.logger.log('GameSocket Disconnecting');
      await this.server.disconnectSockets();
    } else this.logger.log('Game Socket Server already removed');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.validateAccessToken(socket);
    if (typeof socket.data === 'string') {
      this.GameSocketId.set(socket.data, socket.id);
    }
    this.logger.log(
      `GameGateway handleConnection: ${socket.data} -> ${socket.id}`,
    );
    socket.on('disconnecting', async (reason) => {
      /*
      1. 만약에 방에 들어와있는 소켓이 끊긴다면
      2. 그 방 안에 있는 인원들에게 endGame보낸다.
      3. 그 방에 있는 인원들을 전부 나가게 한다.
      4. 그 방을 삭제한다.(조건 04로 변경)
      */

      for (const room of socket.rooms) {
        if (room !== socket.id) {
          this.logger.log(`${room} Game room removing actions`);
          await socket.to(room).emit('endGame'); // 해당 방에 있는 인원에게 게임 끝났음을 알림
          await this.server.socketsLeave(room); // 해당 방에 있는 전원 나가기
          await this.GamesService.endGame(room); // 해당 방 삭제
          if (this.gameQueue.removeAndCheckExistence(room))
            this.logger.log('gameQueue removed');
        }
      }
      if (socket.data) {
        this.logger.log(`Disconnecting Emit End to friends : ${socket.data}`);
        await this.UsersChatsGateway.notifyGameEndToFriends(
          socket.data.toString(),
        );
      }
    });
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    if (typeof socket.data === 'string') {
      this.GameSocketId.delete(socket.data);
    }
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
    this.logger.log(`GameGateway createGameRoom: ${socket.id}`);
    await this.UsersChatsGateway.notifyGameStartToFriends(userId.toString());
    // Notify To friends
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
      this.logger.error('방장은 자신의 게임에 참여할 수 없습니다.');
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
    this.logger.log(userId, 'cancel', message.roomId);
    await socket.leave(message.roomId);
    return 'OK';
  }

  @SubscribeMessage('gameRoomFulfilled')
  async gameStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await socket.to(message.roomId).emit('roomOwner'); // 방장에게 방장임을 알려주는 것
    await socket.emit('roomGuest');
    await this.server.to(message.roomId).emit('gameStart');
    this.logger.log(`Game condition fulfilled: ${message.roomId} started`);
    const userId = socket.data;
    const roomId = message.roomId;
    const type = message.type;
    await this.GamesService.enterRoom(userId, roomId, type);
    await this.GamesService.updateOpponent(userId, roomId);
    await this.GamesService.startGame(userId, roomId);
    await this.UsersChatsGateway.notifyGameStartToFriends(userId.toString());
    return 'OK';
  }
  // Game Data 요청 받고 보내기

  @SubscribeMessage('inGameReq')
  inGame(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const roomId = message.roomId
      ? message.roomId
      : this.getRoomIdFromSocket(socket);
    // {user : owner, data : 350}
    // if (message.type != 'ball')
    // console.log(socket.data, '\n\n', message, '\n\n', roomId);
    socket.to(roomId).emit('inGameRes', message);
    return 'OK';
  }

  @SubscribeMessage('dodge')
  scoreUpdate(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    this.logger.log(`Dodge Game Score Update ${message.roomId}`);
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
  async leaveGameRoom(
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
    await this.UsersChatsGateway.notifyGameEndToFriends(userId.toString());
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
        roomName: 'LADDER_GAME_' + socket.data,
        difficulty: '02',
        score: 5,
        type: '02', // 래더는 02로 설정,
      };
      const roomList = await this.GamesService.createGameRoom(userId, message);
      await this.GamesService.createGameDetail(roomList, userId, message.type);
      await socket.join(roomList.id);
      this.gameQueue.enqueue(roomList.id);
      this.logger.log('Ladder Game Room Created', roomList.id);
      await this.UsersChatsGateway.notifyGameStartToFriends(userId.toString());
      return { roomId: roomList.id, action: 'create' };
    } else {
      const roomId = this.gameQueue.dequeue();
      socket.join(roomId);
      this.logger.log('Ladder Game Room Joined', roomId);
      // await this.gameStart(socket, { roomId: roomId, type: '02' });
      return { roomId: roomId, action: 'join' };
    }
    return 'OK';
  }

  async reqDirectGame(requestId: string, targetId: string) {
    const userId = requestId;
    const option = {
      type: '01',
      roomName: 'DIRECT_GAME_' + userId,
      difficulty: '01',
      score: 5,
    };
    const roomList = await this.GamesService.createGameRoom(userId, option);
    const gameRoomId = await this.GamesService.createGameDetail(
      roomList,
      userId,
      option.type,
    );
    const requesterSocket = this.GameSocketId.get(requestId);
    this.server.in(requesterSocket).socketsJoin(roomList.id);
    const targetSocket = this.GameSocketId.get(targetId);
    this.server.in(targetSocket).socketsJoin(roomList.id);
    // Notify To friends
    await this.UsersChatsGateway.notifyGameStartToFriends(userId);
    return roomList.id;
  }

  async resDirectGame(
    roomId: string,
    requestId: string,
    targetId: string,
    status: boolean,
  ) {
    if (status) {
      const requesterSocketId = this.GameSocketId.get(requestId);
      const targetSocketId = this.GameSocketId.get(targetId);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (!requesterSocketId || !targetSocketId) {
        return 'OK';
      }
      await this.server.to(requesterSocketId).emit('roomOwner');
      await this.server.to(targetSocketId).emit('roomGuest');
      await this.server.to(requesterSocketId).emit('gameStart');
      await this.server.to(targetSocketId).emit('gameStart');

      await this.GamesService.enterRoom(targetId, roomId, '01');
      await this.GamesService.updateOpponent(targetId, roomId);
      await this.GamesService.startGame(targetId, roomId);
      await this.UsersChatsGateway.notifyGameStartToFriends(targetId);
      await this.GamesService.updateDirectGame(roomId);
      return 'OK';
    } else {
      const requesterSocket: Socket = this.server.sockets.sockets.get(
        this.GameSocketId.get(requestId),
      );
      await requesterSocket.emit('gameReject');
      // Reject하면 -> 프론트에서 다른 곳으로 나가고 -> 그렇게 함으로써 소켓 끊으면? 모두 해결
      return 'OK';
    }
  }

  // 내부 함수
  private getRoomIdFromSocket(socket: Socket): string {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        return room;
      }
    }
    return null; // 방이 없는 경우 null 반환
  }
}
