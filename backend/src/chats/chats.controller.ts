import { ChatsService } from './chats.service';
import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ChatroomCreationDto } from './dto/chatroom-creation.dto';
import { ChatroomEntranceDto } from './dto/chatroom-entrance.dto';
import { ChatroomEditingDto } from './dto/chatroom-editing.dto';
import { ChatroomKickingDto } from './dto/chatroom-kicking.dto';
import { ChatroomBanDto } from './dto/chatroom-ban.dto';
import { ChatroomMuteDto } from './dto/chatroom-mute.dto';
import { ChatroomEmpowermentDto } from './dto/chatroom-empowerment.dto';
import { ChatroomGameRequestDto } from './dto/chatroom-game-req.dto';

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
  async setUserToEnter(@CurrentUser() userId: string, @Body() infoEntr: ChatroomEntranceDto) {
    return (await this.chatsService.setUserToEnter(userId, infoEntr));
  }

  @ApiResponse({
    status: 201,
    description: '채팅방 생성 성공',
    type: String, // 성공시 Chatroom_id string 반환
  })
  @ApiOperation({ summary: '채팅방 생성' })
  @Post('create')
  async createChatroom(@CurrentUser() userId: string, @Body() infoCrtn: ChatroomCreationDto) {
    return (await this.chatsService.createChatroom(userId, infoCrtn));
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
  @Patch('edit')
  async editChatroomInfo(@CurrentUser() userId: string, @Body() infoEdit: ChatroomEditingDto) {
    return (await this.chatsService.editChatroomInfo(userId, infoEdit));
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
  async kickUser(@CurrentUser() userId: string, @Body() infoKick: ChatroomKickingDto) {
    return (await this.chatsService.kickUser(userId, infoKick));
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
  @Post('ban')
  async banUser(@CurrentUser() userId: string, @Body() infoBan: ChatroomBanDto) {
    return (await this.chatsService.banUser(userId, infoBan));
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
  @Post('mute')
  async muteUser(@CurrentUser() userId: string, @Body() infoMute: ChatroomMuteDto) {
    return (await this.chatsService.muteUser(userId, infoMute));
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
  async empowerUser(@CurrentUser() userId: string, @Body() infoEmpwr: ChatroomEmpowermentDto) {
    return (await this.chatsService.empowerUser(userId, infoEmpwr));
  }

  @ApiResponse({
    status: 201,
    description: '대결 신청 성공',
  })
  @ApiOperation({ summary: '대결 신청' })
  @Post('game-request')
  async takeGameRequest(@CurrentUser() userId: string, @Body() infoGameReq: ChatroomGameRequestDto) {
    return (await this.chatsService.takeGameRequest(userId, infoGameReq));
  }

  @ApiResponse({
    status: 200,
    description: '채팅방 차단 유저목록 반환해주는 API',
    // type: ChatDto,  향후 추가
  })
  @ApiOperation({ summary: '채팅방 차단 유저목록' })
  @Get('bans/:uuid')
  async getBanListInARoom(@CurrentUser() userId: string, @Param() uuid: string) {
    return (await this.chatsService.getBanListInARoom(userId, uuid));
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
