import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TbUa01MEntity } from "./tb-ua-01-m.entity";
import { TbUa03MEntity } from "./tb-ua-03-m.entity";

// user agent acheivement detail - 유저별업적상세
@Entity({ name: 'TB_UA03D' })
export class TbUa03DEntity {
	// USER_ID
	@PrimaryColumn({ name: 'USER_ID', type: 'varchar', length: 8 })
	@ManyToOne(()=>TbUa01MEntity, (ua01m)=>ua01m.userId, {
		nullable: false,
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	@JoinColumn({ name: 'USER_ID' }) 
	ua01mEntity!: TbUa01MEntity;
	// NOTE - JoinColumn의 name이랑 PrimaryColumn의 name이 다르게 설정되면 이상한 column 생김. 이거 정확한 작동방식을 파악하지 못해서 실제로 적용이 제대로 된건지 답답한데 시간이 없으니까 일단 넘어간다.

	// ACHV_CD
	@PrimaryColumn({ name: 'ACHV_CD', type: 'varchar', length: 200 })
	@ManyToOne(()=>TbUa03MEntity, (ua03m)=>ua03m.achvCd, {
		nullable: false,
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	@JoinColumn({ name: 'ACHV_CD' })
	ua03mEntity: TbUa03MEntity; //REVIEW - string or TbUa03MEntity ? 
	//REVIEW - 대상 Entity 안에서 OneToMany 설정을 안 해도 돌아가네..? 왜? 원인을 정확히 모르므로 안전하게 OneToMany 설정했다.

	// ACHV_DTTM
	@Column({ name: "ACHV_DTTM", type: 'timestamp', precision: 0 })
	achvDttm: Date;

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
