import { HttpModule } from '@nestjs/axios';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategy/jwt.access.strategy';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { DbUsersManagerModule } from 'src/db-manager/db-users-manager/db-users-manager.module';
import { UsersChatsSocketModule } from 'src/users-chats-socket/users-chats-socket.module';

@Module({
  imports: [
    HttpModule,
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
    DbUsersManagerModule,
    UsersChatsSocketModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    AccessTokenStrategy,
    DbUsersManagerService,
  ],
  exports: [AccessTokenStrategy, PassportModule, AuthService],
})
export class AuthModule {}
