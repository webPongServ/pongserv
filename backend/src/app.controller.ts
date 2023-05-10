import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAccessTokenGuard } from './auth/guard/jwt.auth.guard';
import { CurrentUser } from './common/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Get()
  getHello(@CurrentUser() userId: any): string {
    console.log(`userId in /`)
    console.log(userId);
    return this.appService.getHello();
  }
}
