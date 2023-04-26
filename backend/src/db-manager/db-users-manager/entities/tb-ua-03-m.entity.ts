import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { TbUa03DEntity } from "./tb-ua-03-d.entity";

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
	@Column({ name: "FRST_DTTM", type: 'timestamp with time zone', precision: 6 })
	frstDttm: Date;

	// LAST_DTTM
	@Column({ name: "LAST_DTTM", type: 'timestamp with time zone', precision: 6 })
	lastDttm: Date;

	@OneToMany(()=>TbUa03DEntity, (ua03d)=>ua03d.ua03mEntity) //NOTE - 이거 안 넣어도 돌아가는데 돌아가는 이유를 정확히 모르므로 혹시 몰라서 넣음..
	ua03dEntities: TbUa03DEntity[];
}
