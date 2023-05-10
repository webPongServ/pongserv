import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DbManagerService } from './db-manager.service';
import { DbUsersManagerService } from './db-users-manager/db-users-manager.service';

@ApiTags('DbManager')
@Controller('db-manager')
export class DbManagerController {
  constructor(
    // private readonly dbmanagerService: DbManagerService,
    private readonly dbmanagerUsersService: DbUsersManagerService,
  ) {}

}
