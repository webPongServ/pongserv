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
    return this.gamesService.getRoomList();
  }

  @ApiResponse({
    status: 200,
    description: '게임 전적 가져오기 성공',
  })
  @ApiResponse({
    status: 403,
    description: '게임 전적 가져오기 실패',
  })
  @ApiOperation({ summary: '일반 게임 입장' })
  @Get('static/:userId')
  getGameStatic(@Param('userId') user: string) {
    console.log('userId is ', user);
    // return this.gamesService.getGameSummary(user);
    return this.gamesService.getUserStatic(user);
  }
}
