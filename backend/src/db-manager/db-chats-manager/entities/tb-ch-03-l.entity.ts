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
import { TbCh01LEntity } from './tb-ch-01-l.entity';

// chatroom message list
@Entity({ name: 'TB_CH03L' })
@Unique(['ch01lEntity', 'ua01mEntity'])
export class TbCh03LEntity {
  // ID
  @PrimaryGeneratedColumn({ name: 'ID', type: 'bigint' })
  id: number;

  // CHT_RM_ID
  // @PrimaryColumn({ name: 'CHT_RM_ID', type: 'varchar', length: 12 })
  @ManyToOne(() => TbCh01LEntity)
  @JoinColumn({ name: 'CHT_RM_ID' })
  ch01lEntity: TbCh01LEntity;

  // USER_ID
  // @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity)
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity: TbUa01MEntity;

  // MSG_SEQ
  @PrimaryColumn({ name: 'MSG_SEQ', type: 'integer' })
  msgSeq: number;

  // MSG
  @Column({ name: 'MSG', type: 'varchar', length: 1000 })
  msg: string;

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
