import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GamesModule } from './games/games.module';
import { DbManagerModule } from './db-manager/db-manager.module';
import { ChatsModule } from './chats/chats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbUsersManagerService } from './db-manager/db-users-manager/db-users-manager.service';

@Module({
  imports: [
    UserModule,
    GamesModule,
    ChatsModule,
    DbManagerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: '',
      password: '',
      database: 'pongserv',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
