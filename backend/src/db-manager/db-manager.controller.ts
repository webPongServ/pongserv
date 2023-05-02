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

  @Post('/users') // 해달 달의 정보와 그달의 모든 일자에 대한 정보를 데이터로 남겨논다 //크론
  @ApiOperation({ summary: 'set a user data' })
  @ApiResponse({
    status: 201,
    description: 'Success',
    // todo: Set type using dto
  })
  @ApiResponse({
    status: 401,
  })
  setTotalMonthInfo() {
    console.log(`[ POST /db-manager/users ]`);
    return this.dbmanagerUsersService.setUser();
  }
}
