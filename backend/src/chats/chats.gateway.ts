import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'dgram';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway {
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket): string {
    console.log('In ws - message');
    return 'Hello world!';
  }
}
