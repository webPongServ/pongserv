import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAccessTokenGuard } from './auth/guard/jwt.auth.guard';
import { CurrentUser } from './common/decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  getHello(@CurrentUser() userId: any): string {
    console.log(userId);
    return this.appService.getHello();
  }
}
