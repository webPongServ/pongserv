import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbCh01LEntity } from './entities/tb-ch-01-l.entity';
import { TbCh02LEntity } from './entities/tb-ch-02-l.entity';

@Module({
	imports: [
	  TypeOrmModule.forFeature([
		TbCh01LEntity,
		TbCh02LEntity
	  ]),
	],
	providers: []
})
export class DbChatsManagerModule {}
