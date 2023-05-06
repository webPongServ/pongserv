import { ChatsService } from './chats.service';
import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { ChatroomEditingDto } from './dto/chatroom-editing.dto';
import { ChatroomKickingDto } from './dto/chatroom-kicking.dto';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiResponse({
    status: 201,
    description: 'DM 요청 성공',
  })
  @ApiOperation({ summary: 'DM 요청' })
  @Post('dm/:user_id')
  dmRequest() {
    return 'Hello World! it is dmRequest()';
  }

  @ApiResponse({
    status: 200,
    description: '채팅방 목록 반환해주는 API',
    // type: ChatDto,
  })
  @ApiOperation({ summary: '채팅방 목록' })
  @Get('rooms')
  async getChatroomsForAUser(@CurrentUser() userId: string) {
    return (await this.chatsService.getChatroomsForAUser(userId));
  }

  @ApiResponse({
    status: 200,
    description: '채팅방 입장해주는 API',
  })
  @ApiResponse({
    status: 403,
    description: '채팅방 입장 실패',
  })
  @ApiOperation({ summary: '채팅방 입장' })
  @Post('entrance')
  async setUserToEnter(@CurrentUser() userId: string, @Body() chtrmEntr: ChatroomEntranceDto) {
    return (await this.chatsService.setUserToEnter(userId, chtrmEntr));
  }

  @Post('create')
  @ApiResponse({
    status: 201,
    description: '채팅방 생성 성공',
    type: String, // 성공시 Chatroom_id string 반환
  })
  @ApiOperation({ summary: '채팅방 생성' })
  async createChatroom(@CurrentUser() userId: string, @Body() chatroomCreationDto: ChatroomCreationDto) {
    return (await this.chatsService.createChatroom(userId, chatroomCreationDto));
  }

  @ApiResponse({
    status: 201,
    description: '채팅방 정보 수정 성공',
  })
  @ApiResponse({
    status: 403,
    description: '채팅방 정보 수정 실패',
  })
  @ApiOperation({ summary: '채팅방 정보 수정' })
  @Patch('edit/:chatroom_id/:chatroom_name/:chatroom_type/:password')
  async editChatroomInfo(@CurrentUser() userId: string, @Body() chtrmEdit: ChatroomEditingDto) {
    return (await this.chatsService.editChatroomInfo(userId, chtrmEdit));
  }

  @ApiResponse({
    status: 200,
    description: '채팅방 유저목록 반환해주는 API',
    // type: ChatDto,  향후 추가
  })
  @ApiResponse({
    status: 403,
    description: '채팅방 유저목록 반환 실패',
  })
  @ApiOperation({ summary: '채팅방 유저목록' })
  @Get('users/:uuid')
  async getChatUsers(@CurrentUser() userId: string, @Param() uuid: string) {
    return (await this.chatsService.getLiveUserListInARoom(userId, uuid));
  }

  @ApiResponse({
    status: 201,
    description: '채팅방 내보내기 성공',
  })
  @ApiResponse({
    status: 403,
    description: '채팅방 내보내기 실패',
  })
  @ApiOperation({ summary: '채팅방 내보내기' })
  @Put('kick')
  async kickUser(@CurrentUser() userId: string, @Body() chtrmKick: ChatroomKickingDto) {
    return (await this.chatsService.kickUser(userId, chtrmKick));
  }

  @ApiResponse({
    status: 201,
    description: '채팅방 차단 성공',
  })
  @ApiResponse({
    status: 403,
    description: '채팅방 차단 실패(권한 부족)',
  })
  @ApiOperation({ summary: '채팅방 차단' })
  @Post('ban/:chatroom_id/:user_id_to_ban')
  banChatUser() {
    return 'Hello World! it is banChatUser()';
  }

  @ApiResponse({
    status: 201,
    description: '벙어리 적용 성공',
  })
  @ApiResponse({
    status: 403,
    description: '벙어리 적용 실패(권한 부족)',
  })
  @ApiOperation({ summary: '벙어리 적용' })
  @Post('mute/:chatroom_id/:user_id_to_mute')
  muteChatUser() {
    return 'Hello World! it is muteChatUser()';
  }

  @ApiResponse({
    status: 201,
    description: '관리자 권한 부여 성공',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한 부여 실패(권한 부족)',
  })
  @ApiOperation({ summary: '관리자 권한 부여' })
  @Post('empowerment/:chatroom_id/:user_id_to_empower')
  empowermentChatUser() {
    return 'Hello World! it is empowermentChatUser()';
  }

  @ApiResponse({
    status: 201,
    description: '대결 신청 성공',
  })
  @ApiOperation({ summary: '대결 신청' })
  @Post('game-request/:chatroom_id/:user_id_to_game')
  gameRequestChatUser() {
    return 'Hello World! it is gameRequestChatUser()';
  }

  @ApiResponse({
    status: 200,
    description: '채팅방 차단 유저목록 반환해주는 API',
    // type: ChatDto,  향후 추가
  })
  @ApiOperation({ summary: '채팅방 차단 유저목록' })
  @Get('bans/:chatroom_id')
  getChatBans() {
    return 'Hello World! it is getChatBans()';
  }

  @ApiResponse({
    status: 201,
    description: '채팅방 차단 해제 성공',
  })
  @ApiOperation({ summary: '채팅방 차단 해제' })
  @Patch('ban-removal/:chatroom_id/:userid_to_free')
  banRemovalChatUser() {
    return 'Hello World! it is banRemovalChatUser()';
  }
}
