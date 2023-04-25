import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TbCh01LEntity } from "./tb-ch-01-l.entity";

@Entity({ name: 'TB_CH02L' })
export class TbCh02LEntity {
	@ManyToOne(()=>TbCh01LEntity, (ch01l)=>ch01l.chtRmId)
	@JoinColumn({
		name: 'CHT_RM_ID', 
		referencedColumnName: 'CHT_RM_ID'
	})
	chRmId: TbCh01LEntity;

	/* TODO - 
		- USER_ID 생기면 FK(ManyToOne)로 넣을 예정.
		- CHT_RM_ID와 USER_ID를 복합키로 사용해서 PK를 만들 계획.
	*/
	// NOTE - 우선은 PK가 필요하기 때문에 임시로 TMP_ID를 사용.
	@PrimaryGeneratedColumn({ name: 'TMP_ID', type: 'number' })
	tmpId: number;

	@Column({ name: 'CHT_RM_AUTH', type: 'varchar', length: 2 })
	chtRmAuth: string;

	@Column({ name: 'CHT_RM_JOIN_TF', type: 'boolean' })
	chtRmJoinTf: string;

	@Column({ name: 'ENTRY_DTTM', type: 'timestamp', precision: 0 })
	entryDttm: Date;

	@Column({ name: 'AUTH_CHG_DTTM', type: 'timestamp', precision: 0 })
	authChgDttm: Date;

	@Column({ name: 'DEL_FT', type: 'boolean' })
	chtRmTf: boolean;

	@Column({ name: "FRST_DTTM", type: 'timestamp', precision: 6 })
	frstDttm: Date;

	@Column({ name: "LAST_DTTM", type: 'timestamp', precision: 6 })
	lastDttm: Date;
}
