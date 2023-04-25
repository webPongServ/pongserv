import { Column, Entity } from "typeorm";

@Entity({ name: 'TB_GM03D' })
export class TbGm03DEntity {
	// OPT_CD
	@Column({ name: "OPT_CD", type: 'varchar', length: 100 })
	optCd: string;

	// OPT_DTL_CD
	@Column({ name: "OPT_DTL_CD", type: 'varchar', length: 100 })
	optDTlCd: string;

	// OPT_NM
	@Column({ name: "OPT_NM", type: 'varchar', length: 200 })
	optNm: string;

	// OPT_VAL
	@Column({ name: "OPT_VAL", type: 'varchar', length: 200 })
	optVal: string;

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
