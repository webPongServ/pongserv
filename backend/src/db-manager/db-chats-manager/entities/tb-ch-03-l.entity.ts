import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TbCh01LEntity } from './tb-ch-01-l.entity';

// chatroom message list
@Entity({ name: 'TB_CH03L' })
export class TbCh03LEntity {
  // CHT_RM_ID
  @PrimaryColumn({ name: 'CHT_RM_ID', type: 'varchar', length: 12 })
  @ManyToOne(() => TbCh01LEntity, (ch01l) => ch01l.chtRmId, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'CHT_RM_ID' })
  ch01lEntity: TbCh01LEntity;

  // USER_ID
  @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity, (ua01m) => ua01m.userId, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
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
  @Column({ name: 'FRST_DTTM', type: 'timestamp with time zone', precision: 6 })
  frstDttm: Date;

  // LAST_DTTM
  @Column({ name: 'LAST_DTTM', type: 'timestamp with time zone', precision: 6 })
  lastDttm: Date;
}
