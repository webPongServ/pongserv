import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
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
import { TbGm01LEntity } from './tb-gm-01-l.entity';

// ladder ready list - 레더대기내역
@Entity({ name: 'TB_GM04L' })
@Unique(['ua01mEntity', 'gmRsltCd'])
export class TbGm04LEntity {
  // ID
  @PrimaryGeneratedColumn({ name: 'ID', type: 'bigint' })
  id: number;

  // USER_ID
  // @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity)
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity: TbUa01MEntity; // NOTE - TB_UA01M 에서는 설정 안해도 돌아감

  // LDDR_RDY_SRNO
  @Column({ name: 'LDDR_RDY_SRNO', type: 'varchar', length: 12 })
  gmRsltCd: string;

  // MTCH_APLY_DTTM
  @Column({ name: 'MTCH_APLY_DTTM', type: 'timestamp', precision: 0 })
  mtchAplyDttm: Date;

  // MTCH_TF
  @Column({ name: 'MTCH_TF', type: 'boolean' })
  mtchTf: boolean;

  // RDDR_RDY_TF
  @Column({ name: 'RDDR_RDY_TF', type: 'boolean' })
  rddrRdyTf: boolean;

  // MTCH_USER_ID
  @ManyToOne(() => TbUa01MEntity)
  @JoinColumn({ name: 'MTCH_USER_ID' }) // , type: 'varchar', length: 8 })
  ua01mEntityAsMtch: TbUa01MEntity; // NOTE - TB_UA01M 에서는 설정 안해도 돌아감

  // GM_SRNO
  @ManyToOne(() => TbGm01LEntity)
  @JoinColumn({
    name: 'GM_UUID',
  })
  gmUuid: string; //REVIEW - or TbGm01LEntity ?

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
