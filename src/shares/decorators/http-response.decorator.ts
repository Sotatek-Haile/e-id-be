import { applyDecorators, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';

import { PaginationMetadataDto, ResponseDto } from '../dto/base-response.dto';

interface IHttpResponseSuccess extends Omit<ApiResponseOptions, 'status' | 'type'> {
	type: string | Function | [Function];
	status?: 200 | 201;
	serializer?: boolean;
	pagination?: boolean;
}

interface IHttpResponse {
	success?: IHttpResponseSuccess;
}

function initializeDecorators(options?: IHttpResponse): any[] {
	const optionDecorators = [];

	if (options?.success) {
		if (options.success.serializer) {
			optionDecorators.push(UseInterceptors(ClassSerializerInterceptor));
		}
		if (!options.success.status) {
			options.success.status = 200;
		}
		const apiResOpts: ApiResponseOptions = { ...options.success, type: undefined };
		if (options.success.pagination) {
			if (Array.isArray(options.success.type) || typeof options.success.type === 'string') {
				throw new Error('type require function');
			}
			apiResOpts['schema'] = {
				allOf: [
					{ $ref: getSchemaPath(ResponseDto) },
					{
						properties: {
							data: {
								type: 'array',
								items: { $ref: getSchemaPath(options.success.type as Function) },
							},
							metadata: {
								$ref: getSchemaPath(PaginationMetadataDto),
							},
						},
						required: ['metadata'],
					},
				],
			};
			optionDecorators.push(ApiExtraModels(PaginationMetadataDto));
		} else {
			apiResOpts['schema'] = {
				$ref: getSchemaPath(ResponseDto),
				properties: {
					data: {
						$ref: getSchemaPath(options.success.type as Function),
					},
				},
			};
		}
		optionDecorators.push(
			ApiResponse(apiResOpts),
			ApiExtraModels(ResponseDto),
			ApiExtraModels(options.success.type as Function),
		);
	}

	return optionDecorators;
}

export function HttpResponse(
	options?: IHttpResponse,
): <TFunction extends Function, Y>(
	target: object | TFunction,
	propertyKey?: string | symbol,
	descriptor?: TypedPropertyDescriptor<Y>,
) => void {
	const optionDecorators = initializeDecorators(options);
	return applyDecorators(...optionDecorators);
}

export function HttpResponseSuccess(
	options: IHttpResponseSuccess,
): <TFunction extends Function, Y>(
	target: object | TFunction,
	propertyKey?: string | symbol,
	descriptor?: TypedPropertyDescriptor<Y>,
) => void {
	const optionDecorators = initializeDecorators({ success: options });
	return applyDecorators(...optionDecorators);
}
