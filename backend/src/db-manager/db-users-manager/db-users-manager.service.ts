import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TbUa01MEntity } from './entities/tb-ua-01-m.entity';
import { TbUa01LEntity } from './entities/tb-ua-01-l.entity';
import { TbUa02LEntity } from './entities/tb-ua-02-l.entity';
import { TbUa03DEntity } from './entities/tb-ua-03-d.entity';
import { TbUa03MEntity } from './entities/tb-ua-03-m.entity';

@Injectable()
export class DbUsersManagerService {
	constructor(
		@InjectRepository(TbUa01MEntity) private ua01mRp: Repository<TbUa01MEntity>,
		@InjectRepository(TbUa01LEntity) private ua01lRp: Repository<TbUa01LEntity>,
		@InjectRepository(TbUa02LEntity) private ua02lRp: Repository<TbUa02LEntity>,
		@InjectRepository(TbUa03MEntity) private ua03mRp: Repository<TbUa03MEntity>,
		@InjectRepository(TbUa03DEntity) private ua03dRp: Repository<TbUa03DEntity>,
	) { }

  setUser() {
    const test = this.ua01mRp.create();
    console.log(test);
    console.log(`in DbManagerService.serUser`);
  }
}
