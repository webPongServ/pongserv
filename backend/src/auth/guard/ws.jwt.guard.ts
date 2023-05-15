import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient();
    let token = client.handshake.query.token;

    // token이 string 배열일 경우, 첫 번째 토큰을 사용
    if (Array.isArray(token)) {
      token = token[0];
    }

    try {
      const payload = this.jwtService.verify(token);

      // payload에 있는 정보를 client 객체에 할당
      client.data = payload;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }

    return true;
  }
}
