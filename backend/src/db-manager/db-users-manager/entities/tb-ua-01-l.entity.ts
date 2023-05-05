import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { TbUa01MEntity } from './tb-ua-01-m.entity';

// user agent state list - 유저 상태 내역
@Entity({ name: 'TB_UA01L' })
@Unique(['ua01mEntity', 'loginSeq'])
export class TbUa01LEntity {
  // ID
  @PrimaryGeneratedColumn({name: 'ID', type: 'bigint'})
  id: number;

  // @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity)
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity!: TbUa01MEntity;

  // LOGIN_SEQ
    // NOTE: https://orkhan.gitbook.io/typeorm/docs/decorator-reference#versioncolumn
    // OKKY에서 사용하길래 궁금함. 위에 링크 문서를 읽어보니까 incremental number를 입력해주는 것 같음.
  @VersionColumn({ name: 'LOGIN_SEQ'})
  loginSeq: number;

  // LOGIN_DTTM
  @CreateDateColumn({
    name: 'LOGIN_DTTM',
    type: 'timestamp with time zone',
    precision: 0,
  })
  loginDttm: Date;

  // LOGOUT_DTTM
  @Column({
    name: 'LOGOUT_DTTM',
    type: 'timestamp with time zone',
    precision: 0,
    nullable: true 
  })
  logoutDttm: Date;

  // CHT_TF
  @Column({ name: 'CHT_TF', type: 'boolean' })
  chtTf: boolean;

  // GM_TF
  @Column({ name: 'GM_TF', type: 'boolean' })
  gmTf: boolean;

  // REFRESH_TKN
  @Column({ name: 'REFRESH_TKN', type: 'varchar', length: 200 })
  refreshTkn: string;

  // LOGIN_TF
  @Column({ name: 'LOGIN_TF', type: 'boolean' })
  loginTf: boolean;

  // DEL_TF
  @Column({ name: 'DEL_TF', type: 'boolean'})
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
