import { ChatsModule } from './../chats/chats.module';
import { DbGamesManagerModule } from './../db-manager/db-games-manager/db-games-manager.module';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './../auth/auth.service';
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DbUsersManagerModule } from 'src/db-manager/db-users-manager/db-users-manager.module';
import { ChatsService } from 'src/chats/chats.service';

@Module({
  imports: [
    HttpModule,
    DbUsersManagerModule,
    DbGamesManagerModule,
    forwardRef(() => ChatsModule),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1y' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
