import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TbGm01LEntity } from "./tb-gm-01-l.entity";

@Entity({ name: 'TB_GM04L' })
export class TbGm04LEntity {
	// USER_ID
	//TODO - set

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
	//TODO - set

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
