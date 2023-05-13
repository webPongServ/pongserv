import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

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
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  afterInit() {
    this.logger.log('GameGateway init');
  }

  handleConnection() {
    this.logger.log('GameGateway connection');
  }

  handoleDisconnect() {
    this.logger.log('GameGateway disconnect');
  }
}
