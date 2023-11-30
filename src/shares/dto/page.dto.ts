import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsPositive, Max, Min } from 'class-validator';

import { SortDirection } from '~/shares/constants/page-option.constant';

export class PageDto {
	@ApiProperty({ example: 1 })
	@Transform(({ value }) => +value)
	@Min(1)
	@IsPositive()
	@IsNotEmpty()
	page: number;

	@ApiProperty({ example: 10 })
	@Transform(({ value }) => +value)
	@Max(100)
	@Min(1)
	@IsPositive()
	@IsNotEmpty()
	limit: number;

	@ApiPropertyOptional()
	@IsOptional()
	sortBy?: string;

	@ApiPropertyOptional({ enum: SortDirection })
	@IsEnum(SortDirection)
	@IsOptional()
	sortDirection?: SortDirection;

	@ApiPropertyOptional()
	@IsOptional()
	keyword?: string;
}
