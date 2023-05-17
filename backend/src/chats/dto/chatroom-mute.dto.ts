import { ApiProperty } from "@nestjs/swagger";

export class ChatroomMuteDto {
    @ApiProperty({ type: String })
    id: string;

	@ApiProperty({ type: String })
    nicknameToMute: string;
}
