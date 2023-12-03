import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import type { EventData } from 'web3-eth-contract';

import { crawlConfig } from '~/config/crawl.config';
import { PersonRepository } from '~/repositories/person.repository';
import { ELatestBlockType } from '~/schemas/latest-block.schema';
import { BaseCrawlerConsole } from '~/shares/base/base-crawler.console';
import { PersonCrawler } from '~/shares/crawler/person.crawler';
import { UpdateLatestBlock } from '~/shares/decorators/crawler.decorator';

@Console()
@Injectable()
export class PersonConsole extends BaseCrawlerConsole {
	protected readonly blockType: ELatestBlockType = ELatestBlockType.PERSON;

	constructor(private readonly personRepository: PersonRepository) {
		super();
	}

	@Command({ command: 'crawl:person' })
	async crawlPerson(): Promise<void> {
		const latestBlock = await this.latestBlockRepository.getMinBlock(
			this.blockType,
			crawlConfig.contracts.person.firstCrawlBlock,
		);
		const crawler = new PersonCrawler(latestBlock, this.handleCrawlPerson.bind(this));
		crawler.start();

		return new Promise(() => {});
	}

	@UpdateLatestBlock
	private async handleCrawlPerson(events: EventData[]): Promise<void[]> {
		console.log(events);
		for (const event of events) {
			switch (event.event) {
				case 'NewPerson':
					await this.handleNewPerson(event);
					break;
			}
		}
		return Promise.all(
			events.map(event => {
				// this.adminRepo.findOneOrCreateByWalletAddress(event.returnValues.account);
				console.log(event);
			}),
		);
	}

	async handleNewPerson(event: EventData): Promise<void> {
		const { tokenId, owner: ownerAddress, newPerson } = event.returnValues;
		console.log({ tokenId, ownerAddress, newPerson });
		console.log(newPerson[5], newPerson[6], newPerson[7], newPerson.name);
		try {
			await this.personRepository.create({
				name: newPerson.name,
				gender: +newPerson.gender,
				age: +newPerson.age,
				score: +newPerson.score,
				tokenId,
				ownerAddress,
			});
		} catch (error) {
			console.error('handleNewPerson failed ', error, event.returnValues);
		}
	}
}
