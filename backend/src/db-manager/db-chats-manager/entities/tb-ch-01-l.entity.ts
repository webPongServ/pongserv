import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TbCh02LEntity } from './tb-ch-02-l.entity';
import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';

// chatroom list
@Entity({ name: 'TB_CH01L' })
export class TbCh01LEntity {
  // UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // CHT_RM_ID - YYYYMMDDNNNN
  // @PrimaryColumn({ name: 'CHT_RM_ID', type: 'varchar', length: 12 })
  // chtRmId: string;

  // @ManyToOne(() => TbUa01MEntity)
  // @JoinColumn({ name: 'OWNER_ID' })
  // ua01mEntity: TbUa01MEntity;

  // CHT_RM_NM
  @Column({ name: 'CHT_RM_NM', type: 'varchar', length: 50 })
  chtRmNm: string;

  // CHT_RM_TYPE
  @Column({ name: 'CHT_RM_TYPE', type: 'varchar', length: 2 })
  chtRmType: string;

  // MAX_USER_CNT
  @Column({ name: 'MAX_USER_CNT', type: 'integer' })
  maxUserCnt: number;

  // CHT_RM_PWD
  @Column({ name: 'CHT_RM_PWD', type: 'varchar', length: 64, default: '' })
  chtRmPwd: string;

  // CHT_RM_TF
  @Column({ name: 'CHT_RM_TF', type: 'boolean' })
  chtRmTf: boolean;

  // DEL_TF
  @Column({ name: 'DEL_TF', type: 'boolean', default: false })
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

  @OneToMany(() => TbCh02LEntity, (ch02l) => ch02l.ch01lEntity)
  ch02lEntities: TbCh02LEntity[];
}
