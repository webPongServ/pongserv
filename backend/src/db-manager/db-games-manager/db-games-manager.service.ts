import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TbGm01LEntity } from './entities/tb-gm-01-l.entity';
import { TbGm01DEntity } from './entities/tb-gm-01-d.entity';
import { TbGm02SEntity } from './entities/tb-gm-02-s.entity';
import { TbGm03DEntity } from './entities/tb-gm-03-d.entity';
import { TbGm04LEntity } from './entities/tb-gm-04-l.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class DbGamesManagerService {
  constructor(
    @InjectRepository(TbGm01LEntity) private Gm01LRp: Repository<TbGm01LEntity>,
    @InjectRepository(TbGm01DEntity) private Gm01DRp: Repository<TbGm01DEntity>,
    @InjectRepository(TbGm02SEntity) private Gm02SRp: Repository<TbGm02SEntity>,
    @InjectRepository(TbGm03DEntity) private Gm03DRp: Repository<TbGm03DEntity>,
    @InjectRepository(TbGm04LEntity) private Gm04LRp: Repository<TbGm04LEntity>,
  ) {}
}

// constructor(
//   @InjectRepository(TbUa01MEntity) private ua01mRp: Repository<TbUa01MEntity>,
//   @InjectRepository(TbUa01LEntity) private ua01lRp: Repository<TbUa01LEntity>,
//   @InjectRepository(TbUa02LEntity) private ua02lRp: Repository<TbUa02LEntity>,
//   @InjectRepository(TbUa03MEntity) private ua03mRp: Repository<TbUa03MEntity>,
//   @InjectRepository(TbUa03DEntity) private ua03dRp: Repository<TbUa03DEntity>,
// ) {}
