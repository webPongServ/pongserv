import { ApiProperty } from "@nestjs/swagger";

export class ChatroomDirectGameResponseDto {
    @ApiProperty({ type: String })
    gmRmid: string;

    @ApiProperty({ type: String })
    requesterNick: string;
	
	@ApiProperty({ type: Boolean })
	isApproving: boolean;
}
