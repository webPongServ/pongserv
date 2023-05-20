import { ApiProperty } from "@nestjs/swagger";

export class ChatroomDirectGameResponseDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    requesterNick: string;
	
	@ApiProperty({ type: Boolean })
	isApproving: boolean;
}
