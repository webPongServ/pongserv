import { Column, Entity, OneToMany, PrimaryColumn, Unique } from "typeorm";
import { TbUa01LEntity } from "./tb-ua-01-l.entity";
import { TbUa02LEntity } from "./tb-ua-02-l.entity";
import { TbUa03DEntity } from "./tb-ua-03-d.entity";

// user agent master - 유저 기본
@Unique(['nickname'])
@Entity({ name: 'TB_UA01M' })
export class TbUa01MEntity {
	// USER_ID
	@PrimaryColumn({ name: "USER_ID", type: 'varchar', length: 8 })
	userId: string;

	// NICKNAME
	@Column({ name: "NICKNAME", type: 'varchar', length: 8 })
	nickname: string;
	
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
	@Column({ name: "FRST_DTTM", type: 'timestamp with time zone', precision: 6 })
	frstDttm: Date;

	// LAST_DTTM
	@Column({ name: "LAST_DTTM", type: 'timestamp with time zone', precision: 6 })
	lastDttm: Date;

	/**!SECTION
	 * OneToManys
	 */
	@OneToMany(()=>TbUa01LEntity, (ua01l)=>ua01l.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ua01lEntities: TbUa01LEntity[];

	@OneToMany(()=>TbUa02LEntity, (ua02l)=>ua02l.userId, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ua02lEntities: TbUa02LEntity[];

	@OneToMany(()=>TbUa02LEntity, (ua02l)=>ua02l.frUserId, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ua02lEntitiesAsFr: TbUa02LEntity[];

	@OneToMany(()=>TbUa03DEntity, (ua03d)=>ua03d.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ua03dEntities: TbUa03DEntity[];
}
