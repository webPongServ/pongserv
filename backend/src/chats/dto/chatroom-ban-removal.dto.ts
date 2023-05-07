import { ApiProperty } from "@nestjs/swagger";

export class ChatroomBanRemovalDto {
    @ApiProperty({ type: String })
    uuid: string;

	@ApiProperty({ type: String })
    userIdToFree: string;
}
