import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity({ name: 'TB_GM01L' })
export class TbGm01LEntity {
	// GM_SRNO
	@PrimaryColumn({ name: "GM_SRNO", type: 'varchar', length: 12 })
	gmSrno: string;

	// GM_STRT_DTTM
	@Column({ name: "GM_STRT_DTTM", type: 'timestamp', precision: 0 })
	gmStrtDttm: Date;

	// GM_END_DTTM
	@Column({ name: "GM_END_DTTM", type: 'timestamp', precision: 0 })
	gmEndDttm: Date;

	// GM_TYPE
	@Column({ name: "GM_TYPE", type: 'varchar', length: 2 })
	gmType: string;

	// END_TYPE
	@Column({ name: "END_TYPE", type: 'varchar', length: 2 })
	endType: string;

	// TRGT_SCR
	@Column({ name: "TRGT_SCR", type: 'number' })
	trgtScr: number;

	// LV_DFCT
	@Column({ name: "LV_DFCT", type: 'number' })
	lvDfct: number;

	// BGRD_IMG_PAT
	@Column({ name: "BGRD_IMG_PAT", type: 'varchar', length: 200 })
	bgrdImgPat: number;

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

