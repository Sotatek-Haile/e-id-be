import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import type { EventData } from 'web3-eth-contract';

import { crawlConfig } from '~/config/crawl.config';
import { ELatestBlockType } from '~/schemas/latest-block.schema';
import { BaseCrawlerConsole } from '~/shares/base/base-crawler.console';
import { PersonCrawler } from '~/shares/crawler/person.crawler';
import { UpdateLatestBlock } from '~/shares/decorators/crawler.decorator';

@Console()
@Injectable()
export class PersonConsole extends BaseCrawlerConsole {
	protected readonly blockType: ELatestBlockType = ELatestBlockType.PERSON;

	constructor() {
		super();
	}

	@Command({ command: 'crawl:person' })
	async crawlPerson(): Promise<void> {
		const latestBlock = await this.latestBlockRepository.getMinBlock(
			this.blockType,
			crawlConfig.contracts.admin.firstCrawlBlock,
		);
		const crawler = new PersonCrawler(latestBlock, this.handleCrawlPerson.bind(this));
		crawler.start();

		return new Promise(() => {});
	}

	@UpdateLatestBlock
	private async handleCrawlPerson(events: EventData[]): Promise<void[]> {
		return Promise.all(
			events.map(event => {
				// this.adminRepo.findOneOrCreateByWalletAddress(event.returnValues.account);
				console.log(event);
			}),
		);
	}
}
