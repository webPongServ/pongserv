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

// chatroom block list
@Entity({ name: 'TB_CH04L' })
@Unique(['ua01mEntity', 'ua01mEntityAsBlock'])
export class TbCh04LEntity {
  // ID
  @PrimaryGeneratedColumn({ name: 'ID', type: 'bigint' })
  id: number;
  
  // USER_ID
  // @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity, (ua01m) => ua01m.userId, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity: TbUa01MEntity;

  // BLOCK_USER_ID
  // @PrimaryColumn({ name: 'BLOCK_USER_ID', type: 'varchar', length: 8 })
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
