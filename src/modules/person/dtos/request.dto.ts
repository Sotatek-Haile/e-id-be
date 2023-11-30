import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import { EGenderType } from '~/schemas/person.schema';

export class CreatePersonRequestDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsEnum(EGenderType)
	gender: EGenderType;

	@ApiProperty()
	@IsNumber()
	score: number;
}

export class PersonEvent {
	@ApiProperty()
	@IsNumber()
	tokenId: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsNumber()
	amount: number;
}
