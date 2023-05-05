import { Module } from '@nestjs/common';
import { DbUsersManagerModule } from './db-users-manager/db-users-manager.module';
import { DbChatsManagerModule } from './db-chats-manager/db-chats-manager.module';
import { DbGamesManagerModule } from './db-games-manager/db-games-manager.module';
import { DbCommonManagerModule } from './db-common-manager/db-common-manager.module';
import { DbManagerController } from './db-manager.controller';
import { DbManagerService } from './db-manager.service';
import { DbUsersManagerService } from './db-users-manager/db-users-manager.service';

@Module({
  imports: [
    DbUsersManagerModule,
    // DbChatsManagerModule,
    // DbGamesManagerModule,
    // DbCommonManagerModule,
  ],
  controllers: [DbManagerController],
  providers: [DbManagerService],
  exports: [
    DbUsersManagerModule,
    // DbChatsManagerModule,
    // DbGamesManagerModule,
    // DbCommonManagerModule,
  ]
})
export class DbManagerModule {}
