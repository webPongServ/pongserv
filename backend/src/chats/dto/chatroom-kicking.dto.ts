import { ApiProperty } from "@nestjs/swagger";

export class ChatroomKickingDto {
    @ApiProperty({ type: String })
    id: string;

	@ApiProperty({ type: String })
    userIdToKick: string;
}
