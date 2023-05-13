import { ApiProperty } from "@nestjs/swagger";

export class ChatroomResponseMessageDto {
    @ApiProperty({ type: String })
    nickname: string;

    @ApiProperty({ type: String })
    imgPath: string;

	@ApiProperty({ type: String })
	msg: string;

	@ApiProperty({ type: String })
	role: string;
}
