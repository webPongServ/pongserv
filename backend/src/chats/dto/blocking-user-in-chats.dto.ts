import { ApiProperty } from "@nestjs/swagger";

export class BlockingUserInChatsDto {
    @ApiProperty({ type: String })
    nickname: string;

    @ApiProperty({ type: String })
    boolToBlock: boolean;
}
