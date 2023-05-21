import { ApiProperty } from "@nestjs/swagger";

export class ChatroomDirectGameResponseDto {
    @ApiProperty({ type: String })
    gmRmId: string;

    @ApiProperty({ type: String })
    rqstrNick: string;
	
	@ApiProperty({ type: Boolean })
	isApprv: boolean;
}
