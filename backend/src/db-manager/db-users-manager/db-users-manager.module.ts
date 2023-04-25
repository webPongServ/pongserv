import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbUa01LEntity } from './entities/tb-ua-01-l.entity';
import { TbUa01MEntity } from './entities/tb-ua-01-m.entity';
import { TbUa02LEntity } from './entities/tb-ua-02-l.entity';
import { TbUa03DEntity } from './entities/tb-ua-03-d.entity';
import { TbUa03MEntity } from './entities/tb-ua-03-m.entity';

@Module({
	imports: [
	  TypeOrmModule.forFeature([
		TbUa01MEntity,
		TbUa01LEntity,
		TbUa02LEntity,
		// TbUa03MEntity,
		// TbUa03DEntity
	  ]),
	],
	providers: []
})
export class DbUsersManagerModule {}
