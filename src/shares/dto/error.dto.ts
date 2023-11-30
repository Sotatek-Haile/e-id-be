import { ApiProperty } from '@nestjs/swagger';

export class ErrorMessageDto {
	@ApiProperty({
		type: Number,
		example: 400,
	})
	statusCode: number;

	@ApiProperty({
		type: Array,
		example: ['message 1', 'message 2'],
	})
	message: string[];

	@ApiProperty({
		type: String,
		example: 'Bad Request',
	})
	error: string;
}
