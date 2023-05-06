import { DbGamesManagerModule } from './../db-manager/db-games-manager/db-games-manager.module';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesService {
  constructor() {} // private readonly DbGamesManagerModule, // private readonly httpService: HttpService,
}
