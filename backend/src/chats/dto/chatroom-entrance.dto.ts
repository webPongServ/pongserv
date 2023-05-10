import { ApiProperty } from "@nestjs/swagger";

export class ChatroomEntranceDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    pwd: string;
}
