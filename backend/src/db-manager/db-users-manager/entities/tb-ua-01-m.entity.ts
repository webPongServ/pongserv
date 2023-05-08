import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// user agent master - 유저 기본
@Entity({ name: 'TB_UA01M' })
@Unique(['userId'])
@Unique(['nickname'])
export class TbUa01MEntity {
  // ID
  @PrimaryGeneratedColumn({ name: 'ID', type: 'bigint' })
  id: number;

  // USER_ID
  @Column({ name: 'USER_ID', type: 'varchar', length: 8 })
  userId: string;

  // NICKNAME
  @Column({ name: 'NICKNAME', type: 'varchar', length: 8 })
  nickname: string;

  // TWOFACTOR
  @Column({ name: 'TWOFACTOR', type: 'boolean' })
  twofactor: boolean;

  // TWOFACTOR_DATA
  @Column({ name: 'TWOFACTOR_DATA', type: 'varchar', length: 50, nullable: true })
  twofactorData: string;

  // IMG_PATH
  @Column({ name: 'IMG_PATH', type: 'varchar', length: 200 })
  imgPath: string;

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
