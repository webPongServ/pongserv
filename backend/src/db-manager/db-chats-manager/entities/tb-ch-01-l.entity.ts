import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { TbCh02LEntity } from "./tb-ch-02-l.entity";

@Entity({ name: 'TB_CH01L' })
export class TbCh01LEntity {
	// CHT_RM_ID
	@PrimaryColumn({ name: "CHT_RM_ID", type: 'varchar', length: 12 })
	chtRmId: string;

	// CHT_RM_NM
	@Column({ name: "CHT_RM_NM", type: 'varchar', length: 50 })
	chtRmNm: string;

	// CHT_RM_TYPE
	@Column({ name: "CHT_RM_TYPE", type: 'varchar', length: 2 })
	chtRmType: string;

	// MAX_USER_CNT
	@Column({ name: "MAX_USER_CNT", type: 'number' })
	maxUserCnt: number;

	// CHT_RM_PWD
	@Column({ name: "CHT_RM_PWD", type: 'varchar', length: 64 })
	chtRmPwd: string;

	// CHT_RM_TF
	@Column({ name: "CHT_RM_TF", type: 'boolean' })
	chtRmTf: boolean;

	// DEL_TF
	@Column({ name: "DEL_TF", type: 'boolean' })
	delTf: boolean;

	// FRST_DTTM
	@Column({ name: "FRST_DTTM", type: 'timestamp', precision: 6 })
	frstDttm: Date;

	// LAST_DTTM
	@Column({ name: "LAST_DTTM", type: 'timestamp', precision: 6 })
	lastDttm: Date;

	//REVIEW - ch02ls 대신 chatroomUsers 라고 지어야할지 고민
	@OneToMany(()=>TbCh02LEntity, (ch02l)=>ch02l.tbCh01L)
	ch02ls: TbCh02LEntity[];
}
