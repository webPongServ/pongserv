import { ApiProperty } from "@nestjs/swagger";

export class ChatroomEntranceDto {
    @ApiProperty({ type: String })
    uuid: string;

    @ApiProperty({ type: String })
    pwd: string;
}
