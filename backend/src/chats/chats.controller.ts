import { ChatsService } from './chats.service';
import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { ChatroomBanRemovalDto } from './dto/chatroom-ban-removal.dto';
import { ChatroomDmReqDto } from './dto/chatroom-dm-req.dto';
import { AccessTokenStrategy } from 'src/auth/strategy/jwt.access.strategy';
import { ChatroomLeavingDto } from './dto/chatroom-leaving.dto';
import { BlockingUserInChatsDto } from './dto/blocking-user-in-chats.dto';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiResponse({
    status: 201,
    description: 'DM 요청 성공',
  })
  @ApiOperation({ summary: 'DM 요청' })
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Post('dm')
  async takeDmRequest(@CurrentUser() userId: string, @Body() infoDmReq: ChatroomDmReqDto) {
    console.log(`[${userId}: `, `POST /chats/dm]`);
    // console.log(`ChatroomDmReqDto: `);
    // console.log(infoDmReq);
    try {
      const result = await this.chatsService.takeDmRequest(userId, infoDmReq);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
  }

  @ApiResponse({
    status: 200,
    description: '채팅방 목록 반환해주는 API',
    // type: ChatDto,
  })
  @ApiOperation({ summary: '채팅방 목록' })
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Get('rooms')
  async getChatroomsForAUser(@CurrentUser() userId: any) {
    console.log(`[${userId}: `, `GET /chats/rooms]`);
    try {
      const result = await this.chatsService.getChatroomsForAUser(userId);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Post('entrance')
  async setUserToEnter(@CurrentUser() userId: string, @Body() infoEntr: ChatroomEntranceDto) {
    console.log(`[${userId}: `, `POST /chats/entrance]`);
    // console.log(`ChatroomEntranceDto: `);
    // console.log(infoEntr);
    try {
      const result = await this.chatsService.setUserToEnter(userId, infoEntr);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
  }

  @ApiResponse({
    status: 201,
    description: '채팅방 생성 성공',
    type: String, // 성공시 Chatroom_id string 반환
  })
  @ApiOperation({ summary: '채팅방 생성' })
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Post('creation')
  async createChatroom(@CurrentUser() userId: string, @Body() infoCrtn: ChatroomCreationDto) {
    console.log(`[${userId}: `, `POST /chats/creation]`);
    // console.log(`ChatroomCreationDto: `);
    // console.log(infoCrtn);
    try {
      const result = await this.chatsService.createChatroom(userId, infoCrtn);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Patch('edit')
  async editChatroomInfo(@CurrentUser() userId: string, @Body() infoEdit: ChatroomEditingDto) {
    console.log(`[${userId}: `, `PATCH /chats/edit]`);
    // console.log(`ChatroomEditingDto: `);
    // console.log(infoEdit);
    try {
      const result = await this.chatsService.editChatroomInfo(userId, infoEdit);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
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
	@ApiParam({
		name: 'uuid',
		type: String,
	})
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Get('users/:uuid')
  async getChatUsers(@CurrentUser() userId: string, @Param('uuid') uuid: string) {
    console.log(`[${userId}: `, `GET /chats/users/${uuid}]`);
    try {
      const result = await this.chatsService.getLiveUserListInARoom(userId, uuid);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Patch('kick')
  async kickUser(@CurrentUser() userId: string, @Body() infoKick: ChatroomKickingDto) {
    console.log(`[${userId}: `, `PATCH /chats/kick]`);
    console.log(`ChatroomKickingDto: `);
    console.log(infoKick);
    try {
      const result = await this.chatsService.kickUser(userId, infoKick);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Put('ban')
  async banUser(@CurrentUser() userId: string, @Body() infoBan: ChatroomBanDto) {
    console.log(`[${userId}: `, `PUT /chats/ban]`);
    // console.log(`ChatroomBanDto: `);
    // console.log(infoBan);
    try {
      const result = await this.chatsService.banUser(userId, infoBan);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Put('mute')
  async muteUser(@CurrentUser() userId: string, @Body() infoMute: ChatroomMuteDto) {
    console.log(`[${userId}: `, `PUT /chats/mute]`);
    // console.log(`ChatroomMuteDto: `);
    // console.log(infoMute);
    try {
      const result = await this.chatsService.muteUser(userId, infoMute);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Patch('empowerment')
  async empowerUser(@CurrentUser() userId: string, @Body() infoEmpwr: ChatroomEmpowermentDto) {
    console.log(`[${userId}: `, `PATCH /chats/empowerment]`);
    // console.log(`ChatroomEmpowermentDto: `);
    // console.log(infoEmpwr);
    try {
      const result = await this.chatsService.empowerUser(userId, infoEmpwr);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
  }

  @ApiResponse({
    status: 201,
    description: '대결 신청 성공',
  })
  @ApiOperation({ summary: '대결 신청' })
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Post('game-request')
  async takeGameRequest(@CurrentUser() userId: string, @Body() infoGameReq: ChatroomGameRequestDto) {
    console.log(`[${userId}: `, `POST /chats/game-request]`);
    // console.log(`ChatroomGameRequestDto: `);
    // console.log(infoGameReq);
    try {
      const result = await this.chatsService.takeGameRequest(userId, infoGameReq);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
  }

  @ApiResponse({
    status: 200,
    description: '채팅방 차단 유저목록 반환해주는 API',
    // type: ChatDto,  향후 추가
  })
  @ApiOperation({ summary: '채팅방 차단 유저목록' })
  @ApiParam({
		name: 'uuid',
		type: String,
	})
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Get('bans/:uuid')
  async getBanListInARoom(@CurrentUser() userId: string, @Param('uuid') uuid: string) {
    console.log(`[${userId}: `, `GET /chats/bans/${uuid}]`);
    try {
      const result = await this.chatsService.getBanListInARoom(userId, uuid);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
  }

  @ApiResponse({
    status: 201,
    description: '채팅방 차단 해제 성공',
  })
  @ApiOperation({ summary: '채팅방 차단 해제' })
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Patch('ban-removal')
  async removeBan(@CurrentUser() userId: string, @Body() infoBanRmv: ChatroomBanRemovalDto) {
    console.log(`[${userId}: `, `PATCH /chats/ban-removal]`);
    // console.log(`ChatroomBanRemovalDto: `);
    // console.log(infoBanRmv);
    try {
      const result = await this.chatsService.removeBan(userId, infoBanRmv);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
  }

  @ApiResponse({
    status: 201,
    description: '채팅방 나가기 성공',
    type: String, // 성공시 Chatroom_id string 반환
  })
  @ApiOperation({ summary: '채팅방 나가기' })
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Post('leaving')
  async leaveChatroom(@CurrentUser() userId: string, @Body() infoLeav: ChatroomLeavingDto) {
    console.log(`[${userId}: `, `POST /chats/leaving]`);
    // console.log(`ChatroomLeavingDto: `);
    // console.log(infoLeav);
    try {
      const result = await this.chatsService.leaveChatroom(userId, infoLeav);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
  }

  @ApiResponse({
    status: 201,
    description: '특정 유저 채팅 차단',
    type: String, // 성공시 Chatroom_id string 반환
  })
  @ApiOperation({ summary: '특정 유저를 채팅창에서 ' })
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Put('blocking-user')
  async putBlockUserInChats(@CurrentUser() userId: string, @Body() infoBlck: BlockingUserInChatsDto) {
    console.log(`[${userId}: `, `POST /chats/blocking-user]`);
    // console.log(`BlockingUserInChatsDto: `);
    // console.log(infoBlck);
    try {
      const result = await this.chatsService.putBlockUserInChats(userId, infoBlck);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      console.log(`excpt: `);
      console.log(excpt);
      throw excpt;
    }
  }

}
