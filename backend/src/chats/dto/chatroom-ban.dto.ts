import { ApiProperty } from "@nestjs/swagger";

export class ChatroomBanDto {
    @ApiProperty({ type: String })
    uuid: string;

	@ApiProperty({ type: String })
    userIdToBan: string;
}
