import { TbUa01MEntity } from 'src/db-manager/db-users-manager/entities/tb-ua-01-m.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TbGm01LEntity } from './tb-gm-01-l.entity';

// game detail - 게임상세
@Entity({ name: 'TB_GM01D' })
export class TbGm01DEntity {
  // GM_SRNO
  @PrimaryColumn({ name: 'GM_SRNO', type: 'varchar', length: 12 })
  @ManyToOne(() => TbGm01LEntity, (gm01l) => gm01l.gmSrno, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'GM_SRNO' })
  gm01lEntity: TbGm01LEntity; // NOTE - 이거 안 되면 gmSrno: string; 으로 대체. 그러면 다른 것도 다 대체해야함

  // USER_ID
  @PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
  @ManyToOne(() => TbUa01MEntity, (ua01m) => ua01m.userId, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'USER_ID' })
  ua01mEntity: TbUa01MEntity;

  // GET_SCR
  @Column({ name: 'GET_SCR', type: 'integer' })
  getScr: number;

  // GM_RSLT_CD
  @Column({ name: 'GM_RSLT_CD', type: 'varchar', length: 2 })
  gmRsltCd: string;

  // RSLT_LLVL
  @Column({ name: 'RSLT_LLVL', type: 'integer' })
  rsltLlvl: number;

  // ENTRY_DTTM
  @Column({
    name: 'ENTRY_DTTM',
    type: 'timestamp with time zone',
    precision: 0,
  })
  entryDttm: Date;

  // EXIT_DTTM
  @Column({ name: 'EXIT_DTTM', type: 'timestamp with time zone', precision: 0 })
  exitDttm: Date;

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
