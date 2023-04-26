import { TbCh02DEntity } from "src/db-manager/db-chats-manager/entities/tb-ch-02-d.entity";
import { TbCh02LEntity } from "src/db-manager/db-chats-manager/entities/tb-ch-02-l.entity";
import { TbCh03LEntity } from "src/db-manager/db-chats-manager/entities/tb-ch-03-l.entity";
import { TbCh04LEntity } from "src/db-manager/db-chats-manager/entities/tb-ch-04-l.entity";
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
		// TB_UA
	@OneToMany(()=>TbUa01LEntity, (ua01l)=>ua01l.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ua01lEntities: TbUa01LEntity[];

	@OneToMany(()=>TbUa02LEntity, (ua02l)=>ua02l.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ua02lEntities: TbUa02LEntity[];

	@OneToMany(()=>TbUa02LEntity, (ua02l)=>ua02l.ua01mEntityAsFr, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ua02lEntitiesAsFr: TbUa02LEntity[];

	@OneToMany(()=>TbUa03DEntity, (ua03d)=>ua03d.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ua03dEntities: TbUa03DEntity[];

	@OneToMany(()=>TbCh02LEntity, (ch02l)=>ch02l.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
		// TB_CH
	ch02lEntities: TbCh02LEntity[];

	@OneToMany(()=>TbCh02DEntity, (ch02d)=>ch02d.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ch02dEntities: TbCh02DEntity[];

	@OneToMany(()=>TbCh03LEntity, (ch03l)=>ch03l.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ch03lEntities: TbCh03LEntity[];

	@OneToMany(()=>TbCh04LEntity, (ch04l)=>ch04l.ua01mEntity, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ch04lEntities: TbCh03LEntity[];

	@OneToMany(()=>TbCh04LEntity, (ch04l)=>ch04l.ua01mEntityAsBlock, {
		onUpdate: 'CASCADE', 
		onDelete: 'RESTRICT',
	})
	ch04lEntitiesAsBlock: TbCh03LEntity[];
}
