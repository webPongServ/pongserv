import { ApiProperty } from "@nestjs/swagger";

export class ChatroomLeavingDto {
    @ApiProperty({ type: String })
    id: string;
}
