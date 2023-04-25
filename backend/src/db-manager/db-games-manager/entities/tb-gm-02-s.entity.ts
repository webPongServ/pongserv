import { Column, Entity, PrimaryColumn } from "typeorm";

// game statistics by user - 유저별 게임 통계
@Entity({ name: 'TB_GM02S' })
export class TbGm02SEntity {
	// USER_ID
	//TODO - Set FK as USER_ID
	@PrimaryColumn({ type: 'integer' })
	tmpId: number;

	// TOT_RCD
	@Column({ name: "TOT_RCD", type: 'integer' })
	totRcd: number;

	// TOT_VCT
	@Column({ name: "TOT_VCT", type: 'integer' })
	totVct: number;

	// TOT_DFT
	@Column({ name: "TOT_DFT", type: 'integer' })
	totDft: number;

	// LLVL
	@Column({ name: "LLVL", type: 'integer' })
	llvl: number;

	// LDDR_PCENT
	@Column({ name: "LDDR_PCENT", type: 'integer' })
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
