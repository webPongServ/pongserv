import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TbUa01MEntity } from "./tb-ua-01-m.entity";

@Entity({ name: 'TB_UA01L' })
export class TbUa01LEntity {
	// USER_ID
	@ManyToOne(()=>TbUa01MEntity, (ua01m)=>ua01m.userId)
	@JoinColumn({
		name: 'USER_ID',
		referencedColumnName: 'USER_ID'
	})
	userId: string; //REVIEW - or TbUa01MEntity ?

	// LOGIN_SEQ
	@Column({ name: "LOGIN_SEQ", type: 'number' })
	loginSeq: number;

	// LOGIN_DTTM
	@Column({ name: "LOGIN_DTTM", type: 'timestamp', precision: 0 })
	loginDttm: Date;

	// LOGOUT_DTTM
	@Column({ name: "LOGOUT_DTTM", type: 'timestamp', precision: 0 })
	logoutDttm: Date;

	// CHT_TF
	@Column({ name: "CHT_TF", type: 'boolean' })
	chtTf: boolean;

	// GM_TF
	@Column({ name: "GM_TF", type: 'boolean' })
	gmTf: boolean;

	// SESSION_ID
	@Column({ name: "SESSION_ID", type: 'varchar', length: 200 })
	sessionId: string;

	// LOGIN_TF
	@Column({ name: "LOGIN_TF", type: 'boolean' })
	loginTf: boolean;

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
