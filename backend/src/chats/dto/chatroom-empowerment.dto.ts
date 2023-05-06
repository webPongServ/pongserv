import { ApiProperty } from "@nestjs/swagger";

export class ChatroomEmpowermentDto {
    @ApiProperty({ type: String })
    uuid: string;

	@ApiProperty({ type: String })
    userIdToEmpower: string;
}
