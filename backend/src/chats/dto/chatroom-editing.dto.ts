import { ApiProperty } from "@nestjs/swagger";

export class ChatroomEditingDto {
    @ApiProperty({ type: String })
    uuid: string;

	@ApiProperty({ type: String })
    name: string;

	@ApiProperty({ type: String })
    type: string;

	@ApiProperty({ type: String })
    pwd: string;
}