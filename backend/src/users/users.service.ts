import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly AuthService: AuthService,
    private readonly JwtService: JwtService,
  ) {}

  async verifyToken(token: string): Promise<any> {
    try {
      // console.log(token);
      token = token.split(' ')[1];
      const decoded = await this.JwtService.verifyAsync(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
