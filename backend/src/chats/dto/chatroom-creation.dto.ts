import { ApiProperty } from "@nestjs/swagger";

export class ChatroomCreationDto {
    @ApiProperty({ type: String })
    name: string;

    // 01, 02, 03
    @ApiProperty({ type: Boolean })
    type: string;

    @ApiProperty({ type: String })
    pwd: string;
}
