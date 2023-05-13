import { HttpService, HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { GamesGateway } from './games.gateway';

@Module({
  imports: [HttpModule],
  providers: [GamesService, GamesGateway],
  controllers: [GamesController],
})
export class GamesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('games');
  }
}
