import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  HttpStatus,
  HttpException,
  Get,
  Query,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ConfigService } from '@nestjs/config';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  logger = new Logger('UsersController');
  @ApiResponse({
    status: 201,
    description: '로그인 API',
  })
  @ApiOperation({ summary: '로그인' })
  @Get('/login')
  async login(@Headers('authorization') authHeader: string) {
    // console.log(authHeader);/
    if (
      !authHeader ||
      (await this.UsersService.verifyToken(authHeader)) == null
    ) {
      return `https://api.intra.42.fr/oauth/authorize?client_id=${this.config.get(
        'API_UID',
      )}&redirect_uri=${this.config.get('REDIRECT_URI')}&response_type=code`;
    } else {
      // this.logger.error(`Already Logged in!`);
      return (
        'http://' +
        this.config.get('IPADDRESS') +
        ':' +
        this.config.get('FRONT_PORT') +
        '/game'
      );
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Access Token 기반 자신의 간단한 정보를 가져온다.',
  })
  @ApiOperation({ summary: '로그인' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('/me')
  async me(@CurrentUser() user: string) {
    // console.log('In USER/ME' + user);
    return await this.UsersService.getMe(user);
  }

  @ApiResponse({
    status: 201,
    description: 'NickName 변경 성공!.',
  })
  @ApiOperation({ summary: 'NickName 변경' })
  @UseGuards(JwtAccessTokenGuard)
  @Post('/nickname')
  async changeNickname(@CurrentUser() user: string, @Body() body: any) {
    if (body.nickname.length > 10) {
      throw new BadRequestException('닉네임은 10자 이하로 작성해주세요.');
    }
    return this.UsersService.changeNickname(user, body.nickname);
  }

  @ApiResponse({
    status: 201,
    description: '중복되는 NickName이 없습니다.',
  })
  @ApiOperation({ summary: 'NickName 변경 가능여부 확인' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('/nickname')
  async checkNickname(@Query('new') nickname?: string) {
    if (!nickname) {
      return { result: false };
    }
    if (nickname.length > 10) {
      throw new BadRequestException('닉네임은 10자 이하로 작성해주세요.');
    }
    return this.UsersService.checkNickname(nickname);
  }

  @ApiResponse({
    status: 201,
    description: 'User Profile Data 가져오기 성공!.',
  })
  @ApiOperation({ summary: 'Query가 있으면, 친구의 데이터 없으면 내 껏' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('/profile')
  async getProfile(
    @CurrentUser() user: string,
    @Query('friendNickname') friendNickname?: string,
  ) {
    // console.log('FriendNickname', friendNickname);
    if (friendNickname) {
      return await this.UsersService.getProfilebyNickname(user, friendNickname);
    } else {
      return await this.UsersService.getProfile(user);
    }
  }

  @ApiResponse({
    status: 201,
    description: 'User Profile Data 가져오기 성공!.',
  })
  @ApiOperation({ summary: 'Query가 있으면, 친구의 데이터 없으면 내 껏' })
  @UseGuards(JwtAccessTokenGuard)
  @Post('/image')
  async changeImage(
    @CurrentUser() user: string,
    @Body('base64Data') base64Data: string,
  ) {
    if (!base64Data) throw new BadRequestException('base64Data가 없습니다.');
    this.logger.log(`changeImage ${user}`);
    return await this.UsersService.changeImage(user, base64Data);
  }

  @ApiResponse({
    status: 201,
    description: '친구 요청 성공!',
  })
  @ApiOperation({ summary: '친구요청하기' })
  @UseGuards(JwtAccessTokenGuard)
  @Post('/friend')
  async makeFriend(@CurrentUser() user: string, @Body() body: any) {
    this.logger.log(`[makeFriend] user: ${user}, body: ${body.nickname}`);
    return await this.UsersService.makeFriend(user, body.nickname);
  }

  @ApiResponse({
    status: 201,
    description: '친구 요청 성공!',
  })
  @ApiOperation({ summary: '친구요청하기' })
  @UseGuards(JwtAccessTokenGuard)
  @Post('/friend/delete')
  async deleteFriend(@CurrentUser() user: string, @Body() body: any) {
    this.logger.log(`[deleteFriend] user: ${user}, body: ${body.nickname}`);
    return await this.UsersService.deleteFriend(user, body.nickname);
  }

  @ApiResponse({
    status: 201,
    description: '친구 목록 성공!',
  })
  @ApiOperation({ summary: '친구목록 가져오기' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('/friend')
  async getFriendList(@CurrentUser() userId: string) {
    this.logger.log(`[getFriendList] userId: [${userId}]`);
    try {
      const result = await this.UsersService.getFriendList(userId);
      this.logger.log(`[getFriendList] result: ${result.length} Friends`);
      return result;
    } catch (excpt) {
      this.logger.error(`[getFriendList] excpt: ${excpt}`);
      throw excpt;
    }
  }

  @ApiResponse({
    status: 201,
    description: '유저 목록 가져오기 성공!',
  })
  @ApiOperation({ summary: '유저 목록 가져오기 쿼리, 시작하는 것 가져다주기' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('/list')
  async getUserList(@Query('search') startswith: string) {
    return this.UsersService.getUserList(startswith);
  }

  @ApiResponse({
    status: 201,
    description: 'User 게임 전적 가져오기 성공',
  })
  @ApiOperation({ summary: 'User 게임 전적 가져오기' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('/gamehistory')
  async getGameRecord(
    @CurrentUser() user: string,
    @Query('friendNickname') friendNickname?: string,
  ) {
    if (!friendNickname) return this.UsersService.getGameRecord(user);
    return this.UsersService.getGameRecord(user, friendNickname);
  }

  @ApiResponse({
    status: 201,
    description: 'User 업적 가져오기 성공',
  })
  @ApiOperation({ summary: 'User 업적 가져오기' })
  @UseGuards(JwtAccessTokenGuard)
  @Get('/achievement')
  async achievement(
    @CurrentUser() user: string,
    @Query('friendNickname') friendNickname?: string,
  ) {
    if (friendNickname)
      return this.UsersService.achievement(user, friendNickname);
    else {
      return this.UsersService.achievement(user);
    }
  }
}
