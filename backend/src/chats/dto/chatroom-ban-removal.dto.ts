import { ApiProperty } from "@nestjs/swagger";

export class ChatroomBanRemovalDto {
    @ApiProperty({ type: String })
    id: string;

	@ApiProperty({ type: String })
    userIdToFree: string;
}
