import { ELatestBlockType, LatestBlock, LatestBlockSchema } from '~/schemas/latest-block.schema';
import { BaseRepository } from '~/shares/base/base.repository';
import { MongoRepository } from '~/shares/decorators/repository.decorator';

@MongoRepository(LatestBlock, LatestBlockSchema)
export class LatestBlockRepository extends BaseRepository<LatestBlock> {
	async getMinBlock(type: ELatestBlockType, initLatestBlock?: number): Promise<number> {
		let minBlockDb = await this.findOne({ type });

		if (!minBlockDb) {
			minBlockDb = await this.model.create({
				type,
				blockNumber: initLatestBlock ?? 1,
			});
		}

		return minBlockDb.blockNumber;
	}
}
