import { Column, Entity } from "typeorm";

@Entity({ name: 'TB_GM02S' })
export class TbGm02SEntity {
	// USER_ID
	//TODO - add

	// TOT_RCD
	@Column({ name: "TOT_RCD", type: 'number' })
	totRcd: number;

	// TOT_VCT
	@Column({ name: "TOT_VCT", type: 'number' })
	totVct: number;

	// TOT_DFT
	@Column({ name: "TOT_DFT", type: 'number' })
	totDft: number;

	// LLVL
	@Column({ name: "LLVL", type: 'number' })
	llvl: number;

	// LDDR_PCENT
	@Column({ name: "LDDR_PCENT", type: 'number' })
	lddrPcent: number;

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
