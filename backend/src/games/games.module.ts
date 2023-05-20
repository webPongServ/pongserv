import { DbUsersManagerModule } from 'src/db-manager/db-users-manager/db-users-manager.module';
import { DbGamesManagerModule } from './../db-manager/db-games-manager/db-games-manager.module';
import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersChatsSocketModule } from 'src/users-chats-socket/users-chats-socket.module';

@Module({
  imports: [
    ConfigModule,
    DbGamesManagerModule,
    DbUsersManagerModule,
    forwardRef(() => UsersChatsSocketModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1y' },
      }),
    }),
    HttpModule,
  ],
  providers: [GamesService, GamesGateway],
  controllers: [GamesController],
  exports: [GamesService, GamesGateway],
})
export class GamesModule {}
