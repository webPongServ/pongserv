import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TbUa01MEntity } from "./tb-ua-01-m.entity";
import { TbUa03MEntity } from "./tb-ua-03-m.entity";

@Entity({ name: 'TB_UA03D' })
export class TbUa03DEntity {
	// USER_ID
	@ManyToOne(()=>TbUa01MEntity, (ua01m)=>ua01m.userId)
	@JoinColumn({
		name: 'USER_ID',
		referencedColumnName: 'USER_ID'
	})
	userId: string; //REVIEW - or TbUa01MEntity ?

	// ACHV_CD
	@ManyToOne(()=>TbUa03MEntity, (ua03m)=>ua03m.achvCd)
	@JoinColumn({
		name: 'ACHV_CD', 
		referencedColumnName: 'ACHV_CD'
	})
	achvCd: string; //REVIEW - or TbUa03MEntity ?

	// ACHV_DTTM
	@Column({ name: "ACHV_DTTM", type: 'timestamp', precision: 0 })
	achvDttm: Date;

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
