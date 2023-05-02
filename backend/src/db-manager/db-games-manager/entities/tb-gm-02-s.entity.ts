import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

// game statistics by user - 유저별 게임 통계
@Entity({ name: 'TB_GM02S' })
export class TbGm02SEntity {
  // USER_ID
  @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity, (ua01m) => ua01m.userId, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity: TbUa01MEntity; // NOTE - TB_UA01M 에서는 설정 안해도 돌아감

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
  @Column({ name: 'FRST_DTTM', type: 'timestamp with time zone', precision: 6 })
  frstDttm: Date;

  // LAST_DTTM
  @Column({ name: 'LAST_DTTM', type: 'timestamp with time zone', precision: 6 })
  lastDttm: Date;
}
