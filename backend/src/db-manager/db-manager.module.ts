import { Module } from '@nestjs/common';
import { DbChatsManagerModule } from './db-chats-manager/db-chats-manager.module';
import { DbGamesManagerModule } from './db-games-manager/db-games-manager.module';
import { DbUsersManagerModule } from './db-users-manager/db-users-manager.module';

@Module({
  imports: [
    DbChatsManagerModule, 
    DbGamesManagerModule, 
    DbUsersManagerModule
  ]
})
export class DbManagerModule {}
