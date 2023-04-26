import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @ApiProperty({
    description: '게임방 아이디',
    example: '1',
    required: true,
  })
  gamerood_id: string;

  @ApiProperty({
    description: '게임방 이름',
    example: 'game1',
    required: true,
  })
  gameroom_name: string;
  @ApiProperty({
    description: '게임방 주인',
    example: 'chanhyle',
    required: true,
  })
  owner: string;
}
