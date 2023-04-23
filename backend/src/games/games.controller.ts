import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-exception.filter';
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

  // gameroom_id: string	일반 게임 입장	201, 403
  @Post('/normal/entrance')
  entryGame() {
    return 'Hello World! it is entryGame()';
  }

  // gameroom_name: string, score: number, difficulty: string	일반 게임 생성	201, 403	gameroom_id: string
  @Post('/normal/create')
  createGame() {
    return 'Hello World! it is createGame()';
  }

  // gameroom_id: string, gameroom_name: string, score: number, difficulty: string	일반 게임 수정	201, 403
  @Patch('/normal/info')
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
}
