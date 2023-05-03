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

// chatroom user list
@Entity({ name: 'TB_CH02L' })
export class TbCh02LEntity {
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

  // CHT_RM_AUTH
  @Column({ name: 'CHT_RM_AUTH', type: 'varchar', length: 2 })
  chtRmAuth: string;

  // CHT_RM_JOIN_TF
  @Column({ name: 'CHT_RM_JOIN_TF', type: 'boolean' })
  chtRmJoinTf: boolean;

  // ENTRY_DTTM
  @Column({
    name: 'ENTRY_DTTM',
    type: 'timestamp with time zone',
    precision: 0,
  })
  entryDttm: Date;

  // AUTH_CHG_DTTM
  @Column({
    name: 'AUTH_CHG_DTTM',
    type: 'timestamp with time zone',
    precision: 0,
  })
  authChgDttm: Date;

  // DEL_FT
  @Column({ name: 'DEL_FT', type: 'boolean' })
  delTf: boolean;

  // FRST_DTTM
  @Column({ name: 'FRST_DTTM', type: 'timestamp with time zone', precision: 6 })
  frstDttm: Date;

  // LAST_DTTM
  @Column({ name: 'LAST_DTTM', type: 'timestamp with time zone', precision: 6 })
  lastDttm: Date;
}
