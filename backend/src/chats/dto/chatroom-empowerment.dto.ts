import { ApiProperty } from "@nestjs/swagger";

export class ChatroomEmpowermentDto {
    @ApiProperty({ type: String })
    id: string;

	@ApiProperty({ type: String })
    userIdToEmpower: string;
}
