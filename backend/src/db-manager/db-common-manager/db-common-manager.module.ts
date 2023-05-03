import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbCm01DEntity } from './entities/tb-cm-01-d.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TbCm01DEntity])],
  providers: [],
})
export class DbCommonManagerModule {}
