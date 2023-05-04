import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategy/jwt.access.strategy';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';
import { DbUsersManagerModule } from 'src/db-manager/db-users-manager/db-users-manager.module';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'ChanhyleISHandsome',
      signOptions: { expiresIn: '1y' },
    }),
    DbUsersManagerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    AccessTokenStrategy,
    DbUsersManagerService,
  ],
  exports: [AccessTokenStrategy, PassportModule],
})
export class AuthModule {}
