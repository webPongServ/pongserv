import { Column, Entity, PrimaryColumn } from "typeorm";

// user agent acheivement master - 유저업적기본
@Entity({ name: 'TB_UA03M' })
export class TbUa03MEntity {
	// ACHV_CD
	@PrimaryColumn({ name: "ACHV_CD", type: 'varchar', length: 200 })
	achvCd: string;

	// ACHV_NM
	@Column({ name: "ACHV_NM", type: 'varchar', length: 200 })
	achvNm: string;

	// ACHV_CMT
	@Column({ name: "ACHV_CMT", type: 'varchar', length: 1000 })
	achvCmt: string;

	// ACHV_IMG_PATH
	@Column({ name: "ACHV_IMG_PATH", type: 'varchar', length: 200 })
	achvImgPath: string;

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
