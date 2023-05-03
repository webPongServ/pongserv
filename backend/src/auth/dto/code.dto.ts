import { ApiProperty } from '@nestjs/swagger';

export class Code42OAuthData {
  @ApiProperty()
  code: string;
}
