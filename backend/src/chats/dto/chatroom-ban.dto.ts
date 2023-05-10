import { ApiProperty } from "@nestjs/swagger";

export class ChatroomBanDto {
    @ApiProperty({ type: String })
    id: string;

	@ApiProperty({ type: String })
    userIdToBan: string;
}
