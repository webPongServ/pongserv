import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'TB_CH04L' })
export class TbCh04LEntity {
	// USER_ID
	/* TODO - 
		- USER_ID 생기면 FK(ManyToOne)로 넣을 예정.
		- CHT_RM_ID와 USER_ID를 복합키로 사용해서 PK를 만들 계획.
	*/
	// NOTE - 우선은 PK가 필요하기 때문에 임시로 TMP_ID를 사용.
	@PrimaryGeneratedColumn({ name: 'TMP_ID', type: 'number' })
	tmpId: number;

	// BLOCK_USER_ID
	/* TODO - 
		- USER_ID 생기면 FK(ManyToOne)로 넣을 예정.
		- CHT_RM_ID와 USER_ID를 복합키로 사용해서 PK를 만들 계획.
	*/
	// NOTE - 우선은 PK가 필요하기 때문에 임시로 TMP_ID를 사용.
	@PrimaryGeneratedColumn({ name: 'TMP_BLOCK_ID', type: 'number' })
	tmpBlockId: number;

	// ST_CD
	@Column({ name: 'ST_CD', type: 'varchar', length: 2 })
	stCd: string;

	// RSST_DTTM
	@Column({ name: 'RSST_DTTM', type: 'timestamp', precision: 0 })
	rsstDttm: Date;

	// RELE_DTTM
	@Column({ name: 'RELE_DTTM', type: 'timestamp', precision: 0 })
	releDttm: Date;

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
