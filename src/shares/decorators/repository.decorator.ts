import { applyDecorators, Injectable, Type } from '@nestjs/common';
import { Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import paginate from 'mongoose-paginate-v2';

import { REPOSITORY_MODEL_META_KEY, REPOSITORY_SCHEMA_META_KEY } from '../constants/repository.constant';

function Repository<T = any>(target: Type<T>, schema: Schema<T>): (constructor: new (...args: any[]) => any) => void {
	return function (constructor: { new (...args: any[]): any }) {
		Reflect.defineMetadata(REPOSITORY_MODEL_META_KEY, target, constructor);
		schema.plugin(paginate);
		schema.plugin(aggregatePaginate);
		Reflect.defineMetadata(REPOSITORY_SCHEMA_META_KEY, schema, constructor);
	};
}

export function MongoRepository<T = any>(
	target: Type<T>,
	schema: Schema<T>,
): <TFunction extends Function, Y>(
	target: object | TFunction,
	propertyKey?: string | symbol,
	descriptor?: TypedPropertyDescriptor<Y>,
) => void {
	return applyDecorators(Repository(target, schema), Injectable());
}
