import { ApiProperty } from "@nestjs/swagger";

export class ChatroomGameRequestDto {
    @ApiProperty({ type: String })
    uuid: string;

	@ApiProperty({ type: String })
    userIdToGame: string;
}

