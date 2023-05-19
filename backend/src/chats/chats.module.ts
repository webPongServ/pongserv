import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { DbChatsManagerModule } from 'src/db-manager/db-chats-manager/db-chats-manager.module';
import { DbChatsManagerService } from 'src/db-manager/db-chats-manager/db-chats-manager.service';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { DbUsersManagerModule } from 'src/db-manager/db-users-manager/db-users-manager.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DbChatsManagerModule, DbUsersManagerModule, UsersModule],
  providers: [ChatsService, DbChatsManagerService, DbUsersManagerService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}
