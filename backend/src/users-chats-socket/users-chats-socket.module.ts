import { Module, forwardRef } from '@nestjs/common';
import { UsersChatsGateway } from './users-chats.gateway';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';
import { GamesModule } from 'src/games/games.module';

@Module({
	imports: [forwardRef(() => UsersModule), ChatsModule, forwardRef(() => GamesModule)],
	providers: [UsersChatsGateway],
	exports: [UsersChatsGateway],
})
export class UsersChatsSocketModule {}
