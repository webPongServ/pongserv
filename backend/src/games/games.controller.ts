import { GameDto } from './dto/game.dto';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GamesService } from './games.service';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiResponse({
    status: 200,
    description: '게임방 리스트 반환해주는 API',
    type: GameDto,
  })
  @ApiOperation({ summary: '게임방 리스트' })
  @Get('/normal/rooms')
  getAllGames() {
    return 'Hello World! it is getAllGames()';
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @ApiResponse({
    status: 200,
    description: '게임방 입장해주는 API',
  })
  @ApiResponse({
    status: 403,
    description: '게임방 입장 실패',
  })
  @ApiOperation({ summary: '일반 게임 입장' })
  @Post('/normal/entrance/:gameroom_id')
  entryGame(@Param('gameroom_id') gameroom_id: string) {
    return 'Hello World! it is entryGame()';
  }

  @ApiResponse({
    status: 201,
    description: '일반 게임 생성 성공',
    type: String, // 성공시 Gameroom_id string 반환
  })
  @ApiResponse({
    status: 403,
    description: '일반 게임 생성 실패',
  })
  @ApiOperation({ summary: '일반 게임 생성' })
  @Post('/normal/create/:gameroom_name/:score/:difficulty')
  createGame() {
    return 'Hello World! it is createGame()';
  }

  @ApiResponse({
    status: 201,
    description: '일반 게임 수정 성공',
  })
  @ApiResponse({
    status: 403,
    description: '일반 게임 수정 실패',
  })
  @ApiOperation({ summary: '일반 게임 수정' })
  @Patch('/normal/info/:gameroom_id/:gameroom_name/:score/:difficulty')
  changeGameInfo() {
    return 'Hello World! it is changeGameInfo()';
  }

  @ApiResponse({
    status: 201,
    description: '래더 게임 등록 성공',
  })
  @ApiOperation({ summary: '래더 게임 등록' })
  @Post('/ladder/registration')
  ladderRegistration() {
    return 'Hello World! it is ladderRegistration()';
  }

  @ApiResponse({
    status: 201,
    description: '래더 게임 등록 취소 성공',
  })
  @ApiOperation({ summary: '래더 게임 등록 취소' })
  @Patch('/ladder/deregistration')
  ladderDeregistration() {
    return 'Hello World! it is ladderDeregistration()';
  }

  @ApiResponse({
    status: 200,
    description: '게임 결과 화면 정보',
    type: GameDto, // 향후 추가 많음
  })
  @ApiOperation({ summary: '게임 결과 화면' })
  @Get('result/:gameroom_id')
  getGameResult() {
    return 'Hello World! it is getGameResult()';
  }
}
