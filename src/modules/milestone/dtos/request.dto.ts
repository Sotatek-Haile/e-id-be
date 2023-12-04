import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMileStoneRequestDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsNumber()
	score: number;
}
