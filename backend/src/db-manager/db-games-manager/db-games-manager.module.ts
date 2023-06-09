import { TbUa01MEntity } from './../db-users-manager/entities/tb-ua-01-m.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbGm01LEntity } from './entities/tb-gm-01-l.entity';
import { TbGm01DEntity } from './entities/tb-gm-01-d.entity';
import { TbGm02SEntity } from './entities/tb-gm-02-s.entity';
import { TbGm03DEntity } from './entities/tb-gm-03-d.entity';
import { TbGm04LEntity } from './entities/tb-gm-04-l.entity';
import { DbGamesManagerService } from './db-games-manager.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TbGm01LEntity,
      TbGm01DEntity,
      TbGm02SEntity,
      TbGm03DEntity,
      TbGm04LEntity,
      TbUa01MEntity,
    ]),
  ],
  providers: [DbGamesManagerService],
  exports: [DbGamesManagerService, TypeOrmModule],
})
export class DbGamesManagerModule {}
