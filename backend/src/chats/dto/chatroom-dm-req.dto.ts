import { ApiProperty } from "@nestjs/swagger";

export class ChatroomDmReqDto {
    @ApiProperty({ type: String })
    targetNickname: string;
}
