import { ApiProperty } from "@nestjs/swagger";

export class ChatroomGameRequestDto {
    @ApiProperty({ type: String })
    id: string;

	@ApiProperty({ type: String })
    nicknameToGame: string;
}

