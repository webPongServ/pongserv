import { ApiProperty } from "@nestjs/swagger";

export class ChatroomDirectGameRequestDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    targetNickname: string;
}
