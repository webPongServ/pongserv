import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GamesModule } from './games/games.module';
import { DbManagerModule } from './db-manager/db-manager.module';

@Module({
  imports: [UserModule, GamesModule, DbManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
