import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

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

  constructor(private jwtService: JwtService) {
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
      socket.data = payload.intraId;
    } catch (e) {
      socket.emit('exception', 'Invalid token(value in token is not valid)');
      socket.disconnect();
    }
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.validateAccessToken(socket);
    this.logger.log(
      `GameGateway handleConnection: ${socket.id} intraId : ${socket.data}`,
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
  }
}
