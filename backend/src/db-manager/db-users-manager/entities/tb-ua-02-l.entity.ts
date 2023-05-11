import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { TbUa01MEntity } from './tb-ua-01-m.entity';

// user agent friend list - 유저친구내역
@Entity({ name: 'TB_UA02L' })
// @Unique(['ua01mEntity', 'ua01mEntityAsFr'])
// @Unique(['ua01mEntityAsFr'])
export class TbUa02LEntity {
  // ID
  @PrimaryGeneratedColumn({ name: 'ID', type: 'bigint' })
  id: number;

  // USER_ID
  // @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity, (ua01m) => ua01m.ua02lEntitys)
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity: TbUa01MEntity;

  // FR_USER_ID
  // @PrimaryColumn({ name: 'FR_USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity, (ua01m) => ua01m.ua02lEntityAsFrs)
  @JoinColumn({ name: 'FR_USER_ID' })
  ua01mEntityAsFr: TbUa01MEntity;

  // ST_CD
  @Column({ name: 'ST_CD', type: 'varchar', length: 2 })
  stCd: string;

  // RSST_DTTM
  @Column({ name: 'RSST_DTTM', type: 'timestamp with time zone', precision: 0 })
  rsstDttm: Date;

  // RELE_DTTM
  @Column({ name: 'RELE_DTTM', type: 'timestamp with time zone', precision: 0 })
  releDttm: Date;

  // DEL_TF
  @Column({ name: 'DEL_TF', type: 'boolean' })
  delTf: boolean;

  // FRST_DTTM
  @CreateDateColumn({
    name: 'FRST_DTTM',
    type: 'timestamp with time zone',
    precision: 6,
  })
  frstDttm: Date;

  // LAST_DTTM
  @UpdateDateColumn({
    name: 'LAST_DTTM',
    type: 'timestamp with time zone',
    precision: 6,
  })
  lastDttm: Date;
}
