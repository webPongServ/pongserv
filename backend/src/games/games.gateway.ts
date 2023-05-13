import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

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

  constructor() {
    this.logger.log('GameGateway constructor');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`GameGateway handleConnection: ${socket.id}`);
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`GameGateway handleDisconnect: ${socket.id}`);
  }
  afterInit() {
    this.logger.log('GameGateway init');
  }
}
