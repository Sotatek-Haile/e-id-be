import { Inject } from '@nestjs/common';

import { LatestBlockRepository } from '~/repositories/latest-block.repository';
import { ELatestBlockType } from '~/schemas/latest-block.schema';

export abstract class BaseCrawlerConsole {
	protected abstract readonly blockType: ELatestBlockType;

	@Inject()
	protected readonly latestBlockRepository: LatestBlockRepository;

	async updateLatestBlock(latestBlock: number): Promise<boolean> {
		return this.latestBlockRepository.updateOne({ type: this.blockType }, { blockNumber: latestBlock });
	}
}
