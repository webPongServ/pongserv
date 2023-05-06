import { ApiProperty } from "@nestjs/swagger";

export class ChatroomMuteDto {
    @ApiProperty({ type: String })
    uuid: string;

	@ApiProperty({ type: String })
    userIdToMute: string;
}
