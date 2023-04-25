import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TbCh01LEntity } from "./tb-ch-01-l.entity";

@Entity({ name: 'TB_CH02L' })
export class TbCh02LEntity {
	// CHT_RM_ID
	@ManyToOne(()=>TbCh01LEntity, (ch01l)=>ch01l.chtRmId) //REVIEW - , { onDelete: 'CASCADE' }
	@JoinColumn({
		name: 'CHT_RM_ID', 
		referencedColumnName: 'chtRmId' // NOTE - db의 column 이름이 아니라 Entity의 변수 이름을 써야한다.
	})
	chtRmId: TbCh01LEntity;

	/* TODO - 
		- USER_ID 생기면 FK(ManyToOne)로 넣을 예정.
		- CHT_RM_ID와 USER_ID를 복합키로 사용해서 PK를 만들 계획.
	*/
	// NOTE - 우선은 PK가 필요하기 때문에 임시로 TMP_ID를 사용.
	@PrimaryGeneratedColumn({ name: 'TMP_ID', type: 'integer' }) // NOTE - postgresql에서 number type은 없다. interger 등을 이용하자.
	tmpId: number;

	// CHT_RM_AUTH
	@Column({ name: 'CHT_RM_AUTH', type: 'varchar', length: 2 })
	chtRmAuth: string;

	// CHT_RM_JOIN_TF
	@Column({ name: 'CHT_RM_JOIN_TF', type: 'boolean' })
	chtRmJoinTf: boolean;

	// ENTRY_DTTM
	@Column({ name: 'ENTRY_DTTM', type: 'timestamp', precision: 0 })
	entryDttm: Date;

	// AUTH_CHG_DTTM
	@Column({ name: 'AUTH_CHG_DTTM', type: 'timestamp', precision: 0 })
	authChgDttm: Date;

	// DEL_FT
	@Column({ name: 'DEL_FT', type: 'boolean' })
	delTf: boolean;

	// FRST_DTTM
	@Column({ name: "FRST_DTTM", type: 'timestamp', precision: 6 })
	frstDttm: Date;

	// LAST_DTTM
	@Column({ name: "LAST_DTTM", type: 'timestamp', precision: 6 })
	lastDttm: Date;
}
