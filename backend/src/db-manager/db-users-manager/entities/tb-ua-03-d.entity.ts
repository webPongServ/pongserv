import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { TbUa01MEntity } from './tb-ua-01-m.entity';
import { TbUa03MEntity } from './tb-ua-03-m.entity';

// user agent acheivement detail - 유저별업적상세
@Entity({ name: 'TB_UA03D' })
@Unique(['ua01mEntity', 'ua03mEntity'])
export class TbUa03DEntity {
  // ID
  @PrimaryGeneratedColumn({name: 'ID', type: 'bigint'})
  id: number;

  // USER_ID
  // @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity)
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity!: TbUa01MEntity;
  // NOTE - JoinColumn의 name이랑 PrimaryColumn의 name이 다르게 설정되면 이상한 column 생김. 이거 정확한 작동방식을 파악하지 못해서 실제로 적용이 제대로 된건지 답답한데 시간이 없으니까 일단 넘어감.

  // ACHV_CD
  // @PrimaryColumn({ name: 'ACHV_CD', type: 'varchar', length: 200 })
  @ManyToOne(() => TbUa03MEntity)
  @JoinColumn({ name: 'ACHV_CD' })
  ua03mEntity: TbUa03MEntity;
  // NOTE - 대상 Entity 안에서 OneToMany 설정을 안 해도 돌아가네..? 왜? 원인을 정확히 모르므로 안전하게 OneToMany 설정함.

  // ACHV_DTTM
  @Column({ name: 'ACHV_DTTM', type: 'timestamp with time zone', precision: 0 })
  achvDttm: Date;

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
