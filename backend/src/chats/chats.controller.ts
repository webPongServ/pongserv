import { ChatsService } from './chats.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  logger = new Logger('ChatsController');
  @ApiResponse({
    status: 201,
    description: 'DM 요청 성공',
  })
  @ApiOperation({ summary: 'DM 요청' })
  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @Post('dm')
  async takeDmRequest(
    @CurrentUser() userId: string,
    @Body() infoDmReq: ChatroomDmReqDto,
  ) {
    this.logger.log(`[POST /chats/dm] ${userId}`);
    // console.log(`ChatroomDmReqDto: `);
    // console.log(infoDmReq);
    try {
      const result = await this.chatsService.takeDmRequest(userId, infoDmReq);
      // console.log(`result: `);
      // console.log(result);
      return result;
    } catch (excpt) {
      // console.log(`excpt: `);
      // console.log(excpt);
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
  async getChatroomsForAUser(@CurrentUser() userId: string) {
    this.logger.log(`[GET /chats/rooms] ${userId}`);
    try {
      const result = await this.chatsService.getChatroomsForAUser(userId);
      this.logger.log(`[GET /chats/rooms] ${userId} success`);
      return result;
    } catch (excpt) {
      this.logger.log(`[GET /chats/rooms] ${userId} fail`);
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
  async setUserToEnter(
    @CurrentUser() userId: string,
    @Body() infoEntr: ChatroomEntranceDto,
  ) {
    console.log(`[${userId}: `, `POST /chats/entrance]`);
    this.logger.log(`POST /chats/entrance] ${userId}`);
    try {
      const result = await this.chatsService.setUserToEnter(userId, infoEntr);
      this.logger.log(`[POST /chats/entrance] ${userId} success`);
      return result;
    } catch (excpt) {
      this.logger.log(`[POST /chats/entrance] ${userId} fail`);
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
  async createChatroom(
    @CurrentUser() userId: string,
    @Body() infoCrtn: ChatroomCreationDto,
  ) {
    this.logger.log(`[POST /chats/creation] ${userId}`);

    try {
      const result = await this.chatsService.createChatroom(userId, infoCrtn);
      this.logger.log(`[POST /chats/creation] ${userId} success`);
      return result;
    } catch (excpt) {
      this.logger.log(`[POST /chats/creation] ${userId} fail`);
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
  async editChatroomInfo(
    @CurrentUser() userId: string,
    @Body() infoEdit: ChatroomEditingDto,
  ) {
    this.logger.log(`[PATCH /chats/edit] ${userId}`);
    try {
      const result = await this.chatsService.editChatroomInfo(userId, infoEdit);
      this.logger.log(`[PATCH /chats/edit] ${userId} success`);
      return result;
    } catch (excpt) {
      this.logger.log(`[PATCH /chats/edit] ${userId} fail`);
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
  async getChatUsers(
    @CurrentUser() userId: string,
    @Param('uuid') uuid: string,
  ) {
    this.logger.log(`[GET /chats/users/${uuid}] ${userId}`);
    try {
      const result = await this.chatsService.getLiveUserListInARoom(
        userId,
        uuid,
      );
      this.logger.log(`[GET /chats/users/${uuid}] ${userId} success`);
      return result;
    } catch (excpt) {
      this.logger.log(`[GET /chats/users/${uuid}] ${userId} fail`);
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
  async kickUser(
    @CurrentUser() userId: string,
    @Body() infoKick: ChatroomKickingDto,
  ) {
    this.logger.log(
      `[PATCH /chats/kick] ${userId} -> ${infoKick.nicknameToKick}`,
    );
    try {
      const result = await this.chatsService.kickUser(userId, infoKick);
      this.logger.log(
        `[PATCH /chats/kick] ${userId} ${infoKick.nicknameToKick}success`,
      );
      return result;
    } catch (excpt) {
      this.logger.log(
        `[PATCH /chats/kick] ${userId} ${infoKick.nicknameToKick}fail`,
      );
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
  async banUser(
    @CurrentUser() userId: string,
    @Body() infoBan: ChatroomBanDto,
  ) {
    this.logger.log(`[PUT /chats/ban] ${userId} -> ${infoBan.nicknameToBan}`);
    try {
      const result = await this.chatsService.banUser(userId, infoBan);
      this.logger.log(
        `[PUT /chats/ban] ${userId} ${infoBan.nicknameToBan} success`,
      );
      return result;
    } catch (excpt) {
      this.logger.log(
        `[PUT /chats/ban] ${userId} ${infoBan.nicknameToBan} fail`,
      );
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
  async muteUser(
    @CurrentUser() userId: string,
    @Body() infoMute: ChatroomMuteDto,
  ) {
    this.logger.log(
      `[PUT /chats/mute] ${userId} -> ${infoMute.nicknameToMute}`,
    );
    try {
      const result = await this.chatsService.muteUser(userId, infoMute);
      this.logger.log(
        `[PUT /chats/mute] ${userId} ${infoMute.nicknameToMute} success`,
      );
      return result;
    } catch (excpt) {
      this.logger.log(
        `[PUT /chats/mute] ${userId} ${infoMute.nicknameToMute} fail`,
      );
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
  async empowerUser(
    @CurrentUser() userId: string,
    @Body() infoEmpwr: ChatroomEmpowermentDto,
  ) {
    this.logger.log(
      `[PATCH /chats/empowerment] ${userId} -> ${infoEmpwr.nicknameToEmpower}`,
    );
    try {
      const result = await this.chatsService.empowerUser(userId, infoEmpwr);
      this.logger.log(
        `[PATCH /chats/empowerment] ${userId} ${infoEmpwr.nicknameToEmpower} success`,
      );
      return result;
    } catch (excpt) {
      this.logger.log(
        `[PATCH /chats/empowerment] ${userId} ${infoEmpwr.nicknameToEmpower} fail`,
      );
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
  async takeGameRequest(
    @CurrentUser() userId: string,
    @Body() infoGameReq: ChatroomGameRequestDto,
  ) {
    this.logger.log(
      `[POST /chats/game-request] ${userId} -> ${infoGameReq.nicknameToGame}`,
    );
    try {
      const result = await this.chatsService.takeGameRequest(
        userId,
        infoGameReq,
      );
      this.logger.log(
        `[POST /chats/game-request] ${userId} ${infoGameReq.nicknameToGame} success`,
      );
      return result;
    } catch (excpt) {
      this.logger.log(
        `[POST /chats/game-request] ${userId} ${infoGameReq.nicknameToGame} fail`,
      );
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
  async getBanListInARoom(
    @CurrentUser() userId: string,
    @Param('uuid') uuid: string,
  ) {
    this.logger.log(`[GET /chats/bans/${uuid}] ${userId}`);
    try {
      const result = await this.chatsService.getBanListInARoom(userId, uuid);
      this.logger.log(`[GET /chats/bans/${uuid}] ${userId} success`);
      return result;
    } catch (excpt) {
      this.logger.log(`[GET /chats/bans/${uuid}] ${userId} fail`);
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
  async removeBan(
    @CurrentUser() userId: string,
    @Body() infoBanRmv: ChatroomBanRemovalDto,
  ) {
    this.logger.log(
      `[PATCH /chats/ban-removal] ${userId} -> ${infoBanRmv.nicknameToFree}`,
    );
    try {
      const result = await this.chatsService.removeBan(userId, infoBanRmv);
      this.logger.log(
        `[PATCH /chats/ban-removal] ${userId} ${infoBanRmv.nicknameToFree} success`,
      );
      return result;
    } catch (excpt) {
      this.logger.log(
        `[PATCH /chats/ban-removal] ${userId} ${infoBanRmv.nicknameToFree} fail`,
      );
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
  async leaveChatroom(
    @CurrentUser() userId: string,
    @Body() infoLeav: ChatroomLeavingDto,
  ) {
    this.logger.log(`[POST /chats/leaving] ${userId} -> ${infoLeav.id}`);
    try {
      const result = await this.chatsService.leaveChatroom(userId, infoLeav);
      this.logger.log(`[POST /chats/leaving] ${userId} ${infoLeav.id} success`);
      return result;
    } catch (excpt) {
      this.logger.log(`[POST /chats/leaving] ${userId} ${infoLeav.id} fail`);
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
  async putBlockUserInChats(
    @CurrentUser() userId: string,
    @Body() infoBlck: BlockingUserInChatsDto,
  ) {
    this.logger.log(
      `[PUT /chats/blocking-user] ${userId} -> ${infoBlck.nickname}`,
    );
    try {
      const result = await this.chatsService.putBlockUserInChats(
        userId,
        infoBlck,
      );
      this.logger.log(
        `[PUT /chats/blocking-user] ${userId} ${infoBlck.nickname} success`,
      );
      return result;
    } catch (excpt) {
      this.logger.log(
        `[PUT /chats/blocking-user] ${userId} ${infoBlck.nickname} fail`,
      );
      throw excpt;
    }
  }
}
