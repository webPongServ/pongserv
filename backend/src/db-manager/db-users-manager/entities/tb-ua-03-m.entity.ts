import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TbUa03DEntity } from './tb-ua-03-d.entity';

// user agent acheivement master - 유저업적기본
@Entity({ name: 'TB_UA03M' })
export class TbUa03MEntity {
  // ID
  // @PrimaryGeneratedColumn({name: 'ID', type: 'bigint'})
  // id: number;

  // NOTE: 초기에 DB에 세팅해줘야 하는 데이터인데 처음 서비스를 올릴 때 어떻게 바로 세팅할건지 생각해봐야함. 아니면 코드 상으로 업적을 기록하게 해야함.
  // ACHV_CD
  @PrimaryColumn({ name: 'ACHV_CD', type: 'varchar', length: 200 })
  achvCd: string;

  // ACHV_NM
  @Column({ name: 'ACHV_NM', type: 'varchar', length: 200 })
  achvNm: string;

  // ACHV_CMT
  @Column({ name: 'ACHV_CMT', type: 'varchar', length: 1000 })
  achvCmt: string;

  // ACHV_IMG_PATH
  @Column({ name: 'ACHV_IMG_PATH', type: 'varchar', length: 200 })
  achvImgPath: string;

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
