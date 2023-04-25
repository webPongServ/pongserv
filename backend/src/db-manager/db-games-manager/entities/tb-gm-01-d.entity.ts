import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TbGm01LEntity } from "./tb-gm-01-l.entity";

@Entity({ name: 'TB_GM01D' })
export class TbGm01DEntity {
	// GM_SRNO
	@ManyToOne(()=>TbGm01LEntity, (gm01l)=>gm01l.gmSrno)
	@JoinColumn({
		name: 'GM_SRNO',
		referencedColumnName: 'GM_SRNO'
	})
	gmSrno: string; //REVIEW - or TbGm01LEntity ?

	// USER_ID
	//TODO - set

	// GET_SCR
	@Column({ name: "GET_SCR", type: 'number' })
	getScr: number;

	// GM_RSLT_CD
	@Column({ name: "GM_RSLT_CD", type: 'varchar', length: 2 })
	gmRsltCd: string;

	// RSLT_LLVL
	@Column({ name: "RSLT_LLVL", type: 'number' })
	rsltLlvl: number;

	// ENTRY_DTTM
	@Column({ name: "ENTRY_DTTM", type: 'timestamp', precision: 0 })
	entryDttm: Date;

	// EXIT_DTTM
	@Column({ name: "EXIT_DTTM", type: 'timestamp', precision: 0 })
	exitDttm: Date;

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
