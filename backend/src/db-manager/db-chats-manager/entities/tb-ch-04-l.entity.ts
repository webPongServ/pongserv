import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

// chatroom block list
@Entity({ name: 'TB_CH04L' })
export class TbCh04LEntity {
  // USER_ID
  @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity, (ua01m) => ua01m.userId, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity: TbUa01MEntity;

  // BLOCK_USER_ID
  @PrimaryColumn({ name: 'BLOCK_USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity, (ua01m) => ua01m.userId, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'BLOCK_USER_ID' })
  ua01mEntityAsBlock: TbUa01MEntity;

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
  @Column({ name: 'FRST_DTTM', type: 'timestamp with time zone', precision: 6 })
  frstDttm: Date;

  // LAST_DTTM
  @Column({ name: 'LAST_DTTM', type: 'timestamp with time zone', precision: 6 })
  lastDttm: Date;
}
