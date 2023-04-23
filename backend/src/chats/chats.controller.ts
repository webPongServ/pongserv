import { ChatsService } from './chats.service';
import { Controller, Get, Patch, Post, Put } from '@nestjs/common';

@Controller('chats')
export class ChatsController {
  constructor(private readonly ChatsService: ChatsService) {}

  //POST /chats/dm	user_id	DM 요청	201
  @Post('dm/:user_id')
  dmRequest() {
    return 'Hello World! it is dmRequest()';
  }
  //GET /chats/rooms-list		채팅방 목록	200	{chatroom_id: string, chatroom_name: string, owner: string, type: string, curr_user_count: number, max_user_count: number}, ...
  @Get('rooms-list')
  getAllChats() {
    return 'Hello World! it is getAllChats()';
  }

  // POST /chats/entrance	chatroom_id : string password: string	채팅방 입장 (public일 경우에 password 검증 안 함)	201, 403(입장 불가)
  @Post('entrance/:chatroom_id/:password')
  entryChat() {
    return 'Hello World! it is entryChat()';
  }

  //	POST /chats/create	chatroom_name: string, chatroom_type: string, password: string	채팅방 생성	201, 403(형식 제한)	chatroom_id: string
  @Post('create/:chatroom_name/:chatroom_type/:password')
  createChat() {
    return 'Hello World! it is createChat()';
  }

  //PATCH /chats/edit	chatroom_id: string, chatroom_name: string, chatroom_type: string, password: string	채팅방 정보 수정	201, 403(권한 없음)
  @Patch('edit/:chatroom_id/:chatroom_name/:chatroom_type/:password')
  editChat() {
    return 'Hello World! it is editChat()';
  }

  //GET /chats/users	chatroom_id: string	채팅방 유저목록	201, 403(권한 없음)	{user_id: string, user_auth: string}, ...
  @Get('users/:chatroom_id')
  getChatUsers() {
    return 'Hello World! it is getChatUsers()';
  }

  //PUT /chats/kick	chatroom_id: string, user_id_to_kick: string	채팅방 내보내기	201, 403(권한 없음)
  @Put('kick/:chatroom_id/:user_id_to_kick')
  kickChatUser() {
    return 'Hello World! it is kickChatUser()';
  }

  //POST /chats/ban	chatroom_id: string, user_id_to_ban: string	채팅방 차단	201, 403(권한 없음)
  @Post('ban/:chatroom_id/:user_id_to_ban')
  banChatUser() {
    return 'Hello World! it is banChatUser()';
  }

  // POST /chats/mute	chatroom_id: string, user_id_to_mute: string	벙어리 적용	201, 403(권한 없음)
  @Post('mute/:chatroom_id/:user_id_to_mute')
  muteChatUser() {
    return 'Hello World! it is muteChatUser()';
  }

  //POST /chats/empowerment	chatroom_id: string, user_id_to_empower: string	관리자 권한 부여	201, 403(권한 없음)
  @Post('empowerment/:chatroom_id/:user_id_to_empower')
  empowermentChatUser() {
    return 'Hello World! it is empowermentChatUser()';
  }

  //POST /chats/game-request	chatroom_id: string, user_id_to_game: string	대결 신청	201
  @Post('game-request/:chatroom_id/:user_id_to_game')
  gameRequestChatUser() {
    return 'Hello World! it is gameRequestChatUser()';
  }

  //GET /chats/bans	chatroom_id: string	채팅방 차단 유저목록	200	{user_id: string, auth: string}, ...
  @Get('bans/:chatroom_id')
  getChatBans() {
    return 'Hello World! it is getChatBans()';
  }

  // PATCH /chats/ban-removal	chatroom_id: string, userid_to_free: string	채팅방 차단 해제	201
  @Patch('ban-removal/:chatroom_id/:userid_to_free')
  banRemovalChatUser() {
    return 'Hello World! it is banRemovalChatUser()';
  }
}
