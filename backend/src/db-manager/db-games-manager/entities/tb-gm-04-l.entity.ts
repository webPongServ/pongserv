import { TbUa01MEntity } from "src/db-manager/db-users-manager/entities/tb-ua-01-m.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TbGm01LEntity } from "./tb-gm-01-l.entity";

// ladder ready list - 레더대기내역
@Entity({ name: 'TB_GM04L' })
export class TbGm04LEntity {
	// USER_ID
	@PrimaryColumn({ name: "USER_ID", type: 'varchar', length: 8 })
	@ManyToOne(()=>TbUa01MEntity, (ua01m)=>ua01m.userId, {
		nullable: false,
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT'
	})
	@JoinColumn({ name: 'USER_ID' })
	ua01mEntity: TbUa01MEntity; // NOTE - TB_UA01M 에서는 설정 안해도 돌아감

	// LDDR_RDY_SRNO
	@PrimaryColumn({ name: "LDDR_RDY_SRNO", type: 'varchar', length: 12 })
	gmRsltCd: string;

	// MTCH_APLY_DTTM
	@Column({ name: "MTCH_APLY_DTTM", type: 'timestamp', precision: 0 })
	mtchAplyDttm: Date;

	// MTCH_TF
	@Column({ name: "MTCH_TF", type: 'boolean' })
	mtchTf: boolean;

	// RDDR_RDY_TF
	@Column({ name: "RDDR_RDY_TF", type: 'boolean' })
	rddrRdyTf: boolean;

	// MTCH_USER_ID
	@ManyToOne(()=>TbUa01MEntity, (ua01m)=>ua01m.userId, {
		nullable: false,
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT'
	})
	@JoinColumn({ name: 'MTCH_USER_ID' }) // , type: 'varchar', length: 8 })
	ua01mEntityAsMtch: TbUa01MEntity; // NOTE - TB_UA01M 에서는 설정 안해도 돌아감

	// GM_SRNO
	@ManyToOne(()=>TbGm01LEntity, (gm01l)=>gm01l.gmSrno)
	@JoinColumn({
		name: 'GM_SRNO',
		referencedColumnName: 'gmSrno'
	})
	gmSrno: string; //REVIEW - or TbGm01LEntity ?
	
	// DEL_TF
	@Column({ name: "DEL_TF", type: 'boolean' })
	delTf: boolean;

	// FRST_DTTM
	@Column({ name: "FRST_DTTM", type: 'timestamp', precision: 6 })
	frstDttm: Date;

	// LAST_DTTM
	@Column({ name: "LAST_DTTM", type: 'timestamp', precision: 6 })
	lastDttm: Date;
}
