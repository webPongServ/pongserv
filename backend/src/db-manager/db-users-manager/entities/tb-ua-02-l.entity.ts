import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TbUa01MEntity } from "./tb-ua-01-m.entity";

// user agent friend list - 유저친구내역
@Entity({ name: 'TB_UA02L' })
export class TbUa02LEntity {
	// USER_ID
	@PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 12 })
	@ManyToOne(()=>TbUa01MEntity, (ua01m)=>ua01m.userId)
	@JoinColumn({
		name: 'USER_ID',
		referencedColumnName: 'userId'
	})
	userId: TbUa01MEntity; // REVIEW - or TbUa01MEntity ?

	// FR_USER_ID
	@PrimaryColumn({ name: 'FR_USER_ID', type: 'varchar', length: 12 })
	@ManyToOne(()=>TbUa01MEntity, (ua01m)=>ua01m.userId)
	@JoinColumn({
		name: 'FR_USER_ID',
		referencedColumnName: 'userId'
	})
	frUserId: TbUa01MEntity; // REVIEW - or TbUa01MEntity ?

	// ST_CD
	@Column({ name: "ST_CD", type: 'varchar', length: 2 })
	stCd: string;

	// RSST_DTTM
	@Column({ name: "RSST_DTTM", type: 'timestamp', precision: 0 })
	rsstDttm: Date;

	// RELE_DTTM
	@Column({ name: "RELE_DTTM", type: 'timestamp', precision: 0 })
	releDttm: Date;

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
