import { ApiProperty } from '@nestjs/swagger';

export class Token42OAuthData {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
