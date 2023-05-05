import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

// game option detail - 게임옵션상세
@Entity({ name: 'TB_GM03D' })
@Unique(['optCd', 'optDtlCd'])
export class TbGm03DEntity {
  // ID
  @PrimaryGeneratedColumn({ name: 'ID', type: 'bigint' })
  id: number

  // OPT_CD
  @Column({ name: 'OPT_CD', type: 'varchar', length: 100 })
  optCd: string;

  // OPT_DTL_CD
  @Column({ name: 'OPT_DTL_CD', type: 'varchar', length: 100 })
  optDtlCd: string;

  // OPT_NM
  @Column({ name: 'OPT_NM', type: 'varchar', length: 200 })
  optNm: string;

  // OPT_VAL
  @Column({ name: 'OPT_VAL', type: 'varchar', length: 200 })
  optVal: string;

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
