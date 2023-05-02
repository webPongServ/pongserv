import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TB_CM01D' })
export class TbCm01DEntity {
  // TODO - Clean TMP_ID and Set PK
  @PrimaryColumn()
  tmpId: number;

  // CMMN_CD
  @Column({ name: 'CMMN_CD', type: 'varchar', length: 100 })
  cmmnCd: string;

  // CMMN_DTL_CD
  @Column({ name: 'CMMN_DTL_CD', type: 'varchar', length: 100 })
  cmmnDtlCd: string;

  // CMMN_CD_NM
  @Column({ name: 'CMMN_CD_NM', type: 'varchar', length: 200 })
  cmmnCdNm: string;

  // CMMN_CD_DTL_NM
  @Column({ name: 'CMMN_CD_DTL_NM', type: 'varchar', length: 200 })
  cmmnCdDtlNm: string;

  // DEL_TF
  @Column({ name: 'DEL_TF', type: 'boolean' })
  delTf: boolean;

  // FRST_DTTM
  @Column({ name: 'FRST_DTTM', type: 'timestamp', precision: 6 })
  frstDttm: Date;

  // LAST_DTTM
  @Column({ name: 'LAST_DTTM', type: 'timestamp', precision: 6 })
  lastDttm: Date;
}
