import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GamesModule } from './games/games.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [UserModule, GamesModule, ChatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
