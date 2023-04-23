import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // * 게임방 리스트	200	{gameroom_id: string, gameroom_name: string, owner: string}, ...
  @Get('/normal/rooms')
  getAllGames() {
    // return this.gamesService.getAllGames();
    return 'Hello World! it is getAllGames()';
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  // POST gameroom_id: string	일반 게임 입장	201, 403
  @Post('/normal/entrance/:gameroom_id')
  entryGame(@Param('gameroom_id') gameroom_id: string) {
    console.log(gameroom_id);
    return 'Hello World! it is entryGame()';
  }

  // POST gameroom_name: string, score: number, difficulty: string	일반 게임 생성	201, 403	gameroom_id: string
  @Post('/normal/create/:gameroom_name/:score/:difficulty')
  createGame() {
    return 'Hello World! it is createGame()';
  }

  // gameroom_id: string, gameroom_name: string, score: number, difficulty: string	일반 게임 수정	201, 403
  @Patch('/normal/info/:gameroom_id/:gameroom_name/:score/:difficulty')
  changeGameInfo() {
    return 'Hello World! it is changeGameInfo()';
  }

  // 래더 게임 등록	201
  @Post('/ladder/registration')
  ladderRegistration() {
    return 'Hello World! it is ladderRegistration()';
  }

  // 래더 게임 등록 취소	201
  @Patch('/ladder/deregistration')
  ladderDeregistration() {
    return 'Hello World! it is ladderDeregistration()';
  }

  // gameroom_id: string	게임 결과 화면	200	this_info: {game_result: string, game_type: string, user_score: number, opposite_user_id: string, opposite_user_score: number, result_llvl: number}, total_info: {cnt_vct: number, cnt_dft: number, llvl: number}
  @Get('result/:gameroom_id')
  getGameResult() {
    return 'Hello World! it is getGameResult()';
  }
}
