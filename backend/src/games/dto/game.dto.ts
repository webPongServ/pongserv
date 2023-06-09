import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @ApiProperty({
    description: '게임방 아이디 UUID',
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

  @ApiProperty({
    description: '게임방 목표 점수',
    example: '10',
    required: true,
  })
  score: number;

  @ApiProperty({
    description: '게임방 난이도',
    example: '1',
    required: true,
  })
  difficulty: number;

  @ApiProperty({
    description: '게임방 시작여부',
    example: true,
    required: true,
  })
  isStarted: boolean;
}
