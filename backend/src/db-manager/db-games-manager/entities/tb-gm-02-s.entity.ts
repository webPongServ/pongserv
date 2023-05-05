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

// game statistics by user - 유저별 게임 통계
@Entity({ name: 'TB_GM02S' })
@Unique(['ua01mEntity'])
export class TbGm02SEntity {
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

  // TOT_RCD
  @Column({ name: 'TOT_RCD', type: 'integer' })
  totRcd: number;

  // TOT_VCT
  @Column({ name: 'TOT_VCT', type: 'integer' })
  totVct: number;

  // TOT_DFT
  @Column({ name: 'TOT_DFT', type: 'integer' })
  totDft: number;

  // LLVL
  @Column({ name: 'LLVL', type: 'integer' })
  llvl: number;

  // LDDR_PCENT
  @Column({ name: 'LDDR_PCENT', type: 'integer' })
  lddrPcent: number;

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
