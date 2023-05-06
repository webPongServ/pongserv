import { ApiProperty } from "@nestjs/swagger";

export class ChatroomKickingDto {
    @ApiProperty({ type: String })
    uuid: string;

	@ApiProperty({ type: String })
    userIdToKick: string;
}
