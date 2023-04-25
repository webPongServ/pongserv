import { Module } from '@nestjs/common';
import { DbChatsManagerModule } from './db-chats-manager/db-chats-manager.module';
import { DbCommonManagerModule } from './db-common-manager/db-common-manager.module';
import { DbGamesManagerModule } from './db-games-manager/db-games-manager.module';
import { DbUsersManagerModule } from './db-users-manager/db-users-manager.module';

@Module({
  imports: [
    DbUsersManagerModule,
    DbChatsManagerModule,
    DbGamesManagerModule,
    DbCommonManagerModule
  ]
})
export class DbManagerModule {}
