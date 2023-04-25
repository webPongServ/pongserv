import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { TbUa01LEntity } from "./tb-ua-01-l.entity";
import { TbUa02LEntity } from "./tb-ua-02-l.entity";

@Entity({ name: 'TB_UA01M' })
export class TbUa01MEntity {
	// USER_ID
	@PrimaryColumn({ name: "USER_ID", type: 'varchar', length: 8 })
	userId: string;

	// NICKNAME
	@Column({ name: "NICKNAME", type: 'varchar', length: 8 })
	nickname: string; // TODO - Set as unique
	
	// TWOFACTOR
	@Column({ name: "TWOFACTOR", type: 'boolean' })
	chtRmTf: boolean;

	// TWOFACTOR_DATA
	@Column({ name: "TWOFACTOR_DATA", type: 'varchar', length: 50 })
	twofactorData: string;
	
	// IMG_PATH
	@Column({ name: "IMG_PATH", type: 'varchar', length: 200 })
	imgPath: string;

	// DEL_TF
	@Column({ name: "DEL_TF", type: 'boolean' })
	delTf: boolean;

	// FRST_DTTM
	@Column({ name: "FRST_DTTM", type: 'timestamp', precision: 6 })
	frstDttm: Date;

	// LAST_DTTM
	@Column({ name: "LAST_DTTM", type: 'timestamp', precision: 6 })
	lastDttm: Date;

	/**!SECTION
	 * Relation Join
	 */
	@OneToMany(()=>TbUa01LEntity, (ua01l)=>ua01l.userId)
	ua01lEntities: TbUa01LEntity[];

	@OneToMany(()=>TbUa02LEntity, (ua02l)=>ua02l.userId)
	ua02lEntities: TbUa01LEntity[];

	@OneToMany(()=>TbUa02LEntity, (ua02l)=>ua02l.frUserId)
	ua02lEntitiesAsFr: TbUa01LEntity[];
}
