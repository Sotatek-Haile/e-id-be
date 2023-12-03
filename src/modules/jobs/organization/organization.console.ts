import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import type { EventData } from 'web3-eth-contract';

import { crawlConfig } from '~/config/crawl.config';
import { OrganizationRepository } from '~/repositories/organization.repository';
import { ELatestBlockType } from '~/schemas/latest-block.schema';
import { BaseCrawlerConsole } from '~/shares/base/base-crawler.console';
import { OrganizationCrawler } from '~/shares/crawler/organization.crawler';
import { UpdateLatestBlock } from '~/shares/decorators/crawler.decorator';

@Console()
@Injectable()
export class OrganizationConsole extends BaseCrawlerConsole {
	protected readonly blockType: ELatestBlockType = ELatestBlockType.ORGANIZATION;

	constructor(private readonly organizationRepository: OrganizationRepository) {
		super();
	}

	@Command({ command: 'crawl:organization' })
	async crawlOrganization(): Promise<void> {
		const latestBlock = await this.latestBlockRepository.getMinBlock(
			this.blockType,
			crawlConfig.contracts.organization.firstCrawlBlock,
		);
		const crawler = new OrganizationCrawler(latestBlock, this.handleCrawlOrganization.bind(this));
		crawler.start();

		return new Promise(() => {});
	}

	@UpdateLatestBlock
	private async handleCrawlOrganization(events: EventData[]): Promise<void> {
		console.log(events);
		for (const event of events) {
			switch (event.event) {
				case 'NewOrganization':
					await this.handleNewOrganization(event);
					break;
			}
		}
	}

	async handleNewOrganization(event: EventData): Promise<void> {
		const { newPerson, owner: ownerAddress, tokenId } = event.returnValues;
		try {
			await this.organizationRepository.create({
				name: newPerson.name,
				tokenId,
				ownerAddress,
				taxCode: newPerson.taxCode,
			});
		} catch (error) {
			console.error('handleNewOrganization failed ', error, event.returnValues);
		}
	}
}
