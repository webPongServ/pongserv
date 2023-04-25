import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TbCh01LEntity } from "./tb-ch-01-l.entity";

@Entity({ name: 'TB_CH03L' })
export class TbCh03LEntity {
	// CHT_RM_ID
	@ManyToOne(()=>TbCh01LEntity, (ch01l)=>ch01l.chtRmId)
	@JoinColumn({
		name: 'CHT_RM_ID', 
		referencedColumnName: 'chtRmId'
	})
	chtRmId: TbCh01LEntity;

	// USER_ID
	/* TODO - 
		- USER_ID 생기면 FK(ManyToOne)로 넣을 예정.
		- CHT_RM_ID와 USER_ID를 복합키로 사용해서 PK를 만들 계획.
	*/
	// NOTE - 우선은 PK가 필요하기 때문에 임시로 TMP_ID를 사용.
	@PrimaryGeneratedColumn({ name: 'TMP_ID', type: 'integer' })
	tmpId: number;

	// MSG_SEQ
	@Column({ name: 'MSG_SEQ', type: 'integer' })
	msgSeq: number;

	// MSG
	@Column({ name: 'MSG', type: 'varchar', length: 1000 })
	msg: string;

	// DEL_TF
	@Column({ name: 'DEL_TF', type: 'boolean' })
	delTf: boolean;

	// FRST_DTTM
	@Column({ name: "FRST_DTTM", type: 'timestamp', precision: 6 })
	frstDttm: Date;

	// LAST_DTTM
	@Column({ name: "LAST_DTTM", type: 'timestamp', precision: 6 })
	lastDttm: Date;
}
