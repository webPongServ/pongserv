import { Module, forwardRef } from '@nestjs/common';
import { UsersChatsGateway } from './chats.gateway';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [forwardRef(() => UsersModule), ChatsModule],
	providers: [UsersChatsGateway],
	exports: [UsersChatsGateway],
})
export class UsersChatsSocketModule {}
