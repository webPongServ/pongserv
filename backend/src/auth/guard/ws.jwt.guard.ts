import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt-access') {
  constructor(
    private readonly config: ConfigService
	) {
		super();
	}
  canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.headers?.authorization?.split(' ')[1];

    try {
	  console.log()
	  const secret = this.config.get('JWT_SECRET');
      const decoded = jwt.verify(token, secret);
      (context.switchToWs().getData() as any).user = decoded;
    } catch (err) {
      throw new WsException('Invalid credentials');
    }

    return true;
  }
}
