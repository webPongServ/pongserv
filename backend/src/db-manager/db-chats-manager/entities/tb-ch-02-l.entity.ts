import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { TbCh01LEntity } from './tb-ch-01-l.entity';

// chatroom user list
@Entity({ name: 'TB_CH02L' })
@Unique(['ch01lEntity', 'ua01mEntity'])
export class TbCh02LEntity {
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
    nullable: true,
  })
  entryDttm: Date;

  // AUTH_CHG_DTTM
  @Column({
    name: 'AUTH_CHG_DTTM',
    type: 'timestamp with time zone',
    precision: 0,
    nullable: true,
  })
  authChgDttm: Date;

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
