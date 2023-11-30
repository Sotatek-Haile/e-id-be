import { ApiProperty } from '@nestjs/swagger';

import { EGenderType } from '~/schemas/person.schema';

export class PersonResponse {
	@ApiProperty()
	name: string;

	@ApiProperty()
	gender: EGenderType;

	@ApiProperty()
	age?: number;

	@ApiProperty()
	score: number;
}
