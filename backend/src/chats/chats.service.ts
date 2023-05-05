import { Injectable } from '@nestjs/common';
import { DbChatsManagerService } from 'src/db-manager/db-chats-manager/db-chats-manager.service';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { DbUsersManagerService } from 'src/db-manager/db-users-manager/db-users-manager.service';

@Injectable()
export class ChatsService {
	constructor(
		private readonly dbChatsManagerService: DbChatsManagerService,
		private readonly dbUsersManagerService: DbUsersManagerService
	) {}

	async createChatroom(userId: string, chatroomCreationDto: ChatroomCreationDto) {
		const name: string = chatroomCreationDto.name;
		const type: string = chatroomCreationDto.type;
		const pwd: string = chatroomCreationDto.pwd;
		const newChatroom = await this.dbChatsManagerService.createChatroom(name, type, pwd);
		const user = await this.dbUsersManagerService.getUserByUserId(userId);
		await this.dbChatsManagerService.createUserAsOwner(user, newChatroom); // set user as chatroom owner
		return (newChatroom.uuid);
	}
}
