import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class roomOption {
  @IsNotEmpty()
  @ApiProperty({
    description: '게임방 이름',
    example: 'game1',
    required: true,
  })
  roomName: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '게임방 목표 점수',
    example: '10',
    required: true,
  })
  score: number;

  @IsNotEmpty()
  @ApiProperty({
    description: '게임방 난이도',
    example: '1',
    required: true,
  })
  difficulty: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '게임방 타입',
    example: '01',
    required: true,
  })
  type: string;
}
