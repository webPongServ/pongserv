import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TbUa01MEntity } from './entities/tb-ua-01-m.entity';

@Injectable()
export class DbUsersManagerService {
  constructor(
    @InjectRepository(TbUa01MEntity) private ua01mRp: Repository<TbUa01MEntity>, // @InjectRepository(TbUa01LEntity) private ua01lRp: Repository<TbUa01LEntity>,
  ) {}

  setUser() {
    const test = this.ua01mRp.create();
    console.log(test);
    console.log(`in DbManagerService.serUser`);
  }
}
