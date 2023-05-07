import { ApiProperty } from "@nestjs/swagger";

export class ChatroomDmReqDto {
    @ApiProperty({ type: String })
    targetUserId: string;
}
