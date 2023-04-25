import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbCh01LEntity } from './entities/tb-ch-01-l.entity';
import { TbCh02LEntity } from './entities/tb-ch-02-l.entity';
import { TbCh02DEntity } from './entities/tb-ch-02-d.entity';
import { TbCh03LEntity } from './entities/tb-ch-03-l.entity';
import { TbCh04LEntity } from './entities/tb-ch-04-l.entity';

@Module({
	imports: [
	  TypeOrmModule.forFeature([
		TbCh01LEntity,
		TbCh02LEntity,
		TbCh02DEntity,
		TbCh03LEntity,
		TbCh04LEntity
	  ]),
	],
	providers: []
})
export class DbChatsManagerModule {}
