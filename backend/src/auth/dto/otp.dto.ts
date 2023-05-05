import { ApiProperty } from '@nestjs/swagger';

export class otpData {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  sixDigit: string;
}
