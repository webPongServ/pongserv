import { ApiProperty } from "@nestjs/swagger";

export class ChatroomMessageDto {
    @ApiProperty({ type: String })
    chtrmId: string;

    @ApiProperty({ type: String })
    msg: string;
}
