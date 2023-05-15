import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EnterOption {
  @ApiProperty({
    description: '게임방 이름',
    example: 'game1',
    required: true,
  })
  roomName: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '게임방 Room ID',
    example: 'aa24a26c-1950-4c64-878c-437e8630693b',
    required: true,
  })
  roomId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '게임 타입',
    example: '00',
    required: true,
  })
  type: string;
}
