import { ApiProperty } from "@nestjs/swagger";

export class ChatroomRequestMessageDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    msg: string;
}
