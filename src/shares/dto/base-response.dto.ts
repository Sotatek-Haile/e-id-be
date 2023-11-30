import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ObjectLiteral } from '../interfaces/object-literal.interface';

export class ResponseDto<T = any> {
	@ApiProperty({ default: 0 })
	code: number = 0;

	@ApiProperty({ default: 'success' })
	message: string = 'success';

	@ApiProperty()
	data: T;

	@ApiPropertyOptional()
	metadata: ObjectLiteral;

	constructor(data: any) {
		if (!data) {
			this.data = {} as T;
			return this;
		}

		if (typeof data === 'object' && data?.docs) {
			const { docs, ...metadata } = data;
			this.data = docs;
			this.metadata = metadata;
		} else {
			this.data = data;
		}
	}
}

export class PaginationMetadataDto {
	@ApiProperty()
	totalDocs: number;

	@ApiProperty()
	limit: number;

	@ApiProperty()
	totalPages: number;

	@ApiProperty()
	page: number;

	@ApiProperty()
	pagingCounter: number;

	@ApiProperty()
	hasPrevPage: boolean;

	@ApiProperty()
	hasNextPage: boolean;

	@ApiProperty()
	prevPage: number;

	@ApiProperty()
	nextPage: number;
}
