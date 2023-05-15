import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TbGm01DEntity } from './tb-gm-01-d.entity';

// game list - 게임내역
@Entity({ name: 'TB_GM01L' })
export class TbGm01LEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // GM_NAME - 게임명
  @Column({ name: 'GM_NAME', type: 'varchar', length: 50 })
  gmRmNm: string;

  // GM_STRT_DTTM
  @Column({
    name: 'GM_STRT_DTTM',
    type: 'timestamp with time zone',
    precision: 0,
    nullable: true,
  })
  gmStrtDttm: Date;

  // GM_END_DTTM
  @Column({
    name: 'GM_END_DTTM',
    type: 'timestamp with time zone',
    precision: 0,
    nullable: true,
  })
  gmEndDttm: Date;

  // GM_TYPE
  @Column({ name: 'GM_TYPE', type: 'varchar', length: 2 })
  gmType: string;

  // END_TYPE
  @Column({ name: 'END_TYPE', type: 'varchar', length: 2, nullable: true })
  endType: string;

  // TRGT_SCR
  @Column({ name: 'TRGT_SCR', type: 'integer' })
  trgtScr: number;

  // LV_DFCT
  @Column({ name: 'LV_DFCT', type: 'varchar', length: 2 })
  lvDfct: string;

  // GM_OWNER
  @Column({
    name: 'GM_OWNER',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  owner: string;

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
