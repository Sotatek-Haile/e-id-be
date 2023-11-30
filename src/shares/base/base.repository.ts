import type { BulkWriteResult } from 'mongodb';
import {
	Aggregate,
	AggregatePaginateModel,
	AggregatePaginateResult,
	ClientSession,
	Document,
	FilterQuery,
	HydratedDocument,
	Model,
	PaginateModel,
	PaginateOptions,
	PaginateResult,
	QueryOptions,
	SaveOptions,
	UpdateQuery,
	UpdateWithAggregationPipeline,
} from 'mongoose';
import { LoggerService } from 'shares/helpers/logger';
import { withTransaction } from 'shares/helpers/transaction';
import winston from 'winston';

import { SortDirection } from '../constants/page-option.constant';
import { PageDto } from '../dto/page.dto';

export abstract class BaseRepository<T> {
	protected model: Model<T & Document> & PaginateModel<T & Document> & AggregatePaginateModel<T & Document>;
	public collectionName: string;
	private readonly logger: winston.Logger;

	constructor(model: Model<T & Document> & PaginateModel<T & Document> & AggregatePaginateModel<T & Document>) {
		this.model = model;

		this.collectionName = model.collection.collectionName;
		this.logger = LoggerService.get(this.constructor.name);
	}

	async withTransaction<R = any>(fn: (session: ClientSession) => Promise<R>): Promise<R> {
		return withTransaction(this.model.db, fn);
	}

	async startTransaction(): Promise<ClientSession> {
		const session = await this.model.startSession();
		session.startTransaction();
		return session;
	}

	async findOne(
		filter?: FilterQuery<T & Document>,
		projection?: Partial<Record<keyof T, 1 | 0>>,
		options?: QueryOptions,
	): Promise<T & Document> {
		return this.model.findOne(filter, projection, options);
	}

	async updateOne(
		filter?: FilterQuery<T & Document>,
		update?: UpdateQuery<T & Document> | UpdateWithAggregationPipeline,
		options?: QueryOptions,
	): Promise<boolean> {
		const raw = await this.model.updateOne(filter, update, options);
		if (raw.modifiedCount)
			this.logger.info(`update ${this.model.collection.collectionName}`, {
				filter,
				update,
			});
		return !!raw.modifiedCount;
	}

	async find(
		filter?: FilterQuery<T & Document>,
		projection?: Partial<Record<keyof T, 1 | 0>>,
		options?: QueryOptions | null,
	): Promise<HydratedDocument<T & Document<any, any, any>, {}, {}>[]> {
		return this.model.find(filter, projection, options);
	}

	async paginate(query?: FilterQuery<T>, options?: PaginateOptions & PageDto): Promise<PaginateResult<T & Document>> {
		if (options.sortBy) {
			options.sort = { [options.sortBy]: options.sortDirection || SortDirection.ASC };
		}

		return this.model.paginate(query, { ...options });
	}

	async paginateAggregate(
		query?: Aggregate<(T & Document<any, any, any>)[]>,
		options?: PaginateOptions & PageDto,
	): Promise<AggregatePaginateResult<T & Document>> {
		if (options?.sortBy) {
			options.sort = { [options.sortBy]: options?.sortDirection || SortDirection.ASC };
		}

		return this.model.aggregatePaginate(query, { ...options });
	}

	async findOneAndUpdate(
		filter?: FilterQuery<T & Document>,
		update?: UpdateQuery<T & Document>,
		options?: QueryOptions | null,
	): Promise<T & Document> {
		const entity = await this.model.findOneAndUpdate(filter, update, options);
		return entity;
	}

	async findByIdUpdate(
		id: string,
		update?: UpdateQuery<T & Document>,
		options?: QueryOptions & { upsert?: true },
	): Promise<T & Document> {
		const entity = await this.model.findByIdAndUpdate(id, update, options);
		if (entity)
			this.logger.info(`update ${this.model.collection.collectionName}`, {
				id,
				update,
				entity: entity.toJSON(),
			});

		return entity;
	}

	async findOneAndDelete(filter?: FilterQuery<T & Document>, options?: QueryOptions | null): Promise<T & Document> {
		const entity = await this.model.findOneAndDelete(filter, options);
		if (entity)
			this.logger.info(`Delete ${this.model.collection.collectionName}`, {
				filter,
			});

		return entity;
	}

	async deleteOne(filter?: FilterQuery<T & Document>, options?: QueryOptions): Promise<boolean> {
		const raw = await this.model.deleteOne(filter, options);
		if (raw.deletedCount)
			this.logger.info(`delete  ${this.model.collection.collectionName}`, {
				filter,
			});
		return !!raw.deletedCount;
	}

	async updateMany(
		filter?: FilterQuery<T & Document>,
		update?: UpdateWithAggregationPipeline | UpdateQuery<T & Document>,
		options?: QueryOptions,
	): Promise<boolean> {
		const raw = await this.model.updateMany(filter, update, options);
		if (raw.modifiedCount)
			this.logger.info(`update ${raw.modifiedCount} ${this.model.collection.collectionName}`, {
				filter,
			});
		return !!raw.modifiedCount;
	}

	async deleteMany(filter?: FilterQuery<T & Document>, options?: QueryOptions): Promise<boolean> {
		const raw = await this.model.deleteMany(filter, options);
		if (raw.deletedCount)
			this.logger.info(`delete ${raw.deletedCount} ${this.model.collection.collectionName}`, {
				filter,
			});
		return !!raw.deletedCount;
	}

	async bulkWrite(writes: any[]): Promise<BulkWriteResult> {
		return this.model.bulkWrite(writes);
	}

	async create(item: Partial<T>): Promise<HydratedDocument<T>> {
		return this.model.create(item);
	}

	async createMany(item: Partial<T>[], options?: SaveOptions): Promise<void> {
		await this.model.create(item, options);
	}

	async aggregateGetOne<T>(query?: Aggregate<(T & Document<any, any, any>)[]>): Promise<T> {
		const results = await query.exec();
		return results.length ? results[0] : null;
	}

	async getRandomOne(filter: FilterQuery<T>): Promise<HydratedDocument<T>> {
		const query = this.model.aggregate([{ $match: filter }, { $sample: { size: 1 } }]);
		return this.aggregateGetOne(query);
	}
}
