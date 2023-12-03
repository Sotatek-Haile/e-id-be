import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import type { EventData } from 'web3-eth-contract';

import { crawlConfig } from '~/config/crawl.config';
import { PersonRepository } from '~/repositories/person.repository';
import { ScoreHistoryRepository } from '~/repositories/score-history.repository';
import { ELatestBlockType } from '~/schemas/latest-block.schema';
import { BaseCrawlerConsole } from '~/shares/base/base-crawler.console';
import { PersonCrawler } from '~/shares/crawler/person.crawler';
import { UpdateLatestBlock } from '~/shares/decorators/crawler.decorator';

@Console()
@Injectable()
export class PersonConsole extends BaseCrawlerConsole {
	protected readonly blockType: ELatestBlockType = ELatestBlockType.PERSON;

	constructor(
		private readonly personRepo: PersonRepository,
		private readonly scoreHistoryRepo: ScoreHistoryRepository,
	) {
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
	private async handleCrawlPerson(events: EventData[]): Promise<void> {
		console.log(events);
		for (const event of events) {
			switch (event.event) {
				case 'NewPerson':
					await this.handleNewPerson(event);
					break;
			}

			switch (event.event) {
				case 'EditPerson':
					await this.handleEditPerson(event);
					break;
			}

			switch (event.event) {
				case 'ScoreChange':
					await this.handleScoreChange(event);
					break;
			}
		}
	}

	async handleNewPerson(event: EventData): Promise<void> {
		const { tokenId, owner: ownerAddress, newPerson } = event.returnValues;
		try {
			await this.personRepo.create({
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

	async handleEditPerson(event: EventData): Promise<void> {
		console.log(event.returnValues);
		const { tokenId, newPerson } = event.returnValues;
		try {
			await this.personRepo.updateOne(
				{
					tokenId,
				},
				{
					$set: {
						name: newPerson.name,
						gender: +newPerson.gender,
						age: +newPerson.age,
						score: +newPerson.score,
						sensitiveInformation: newPerson.sensitiveInformation,
					},
				},
			);
		} catch (error) {
			console.error('handleEditPerson failed ', error, event.returnValues);
		}
	}

	async handleScoreChange(event: EventData): Promise<void> {
		console.log(event.returnValues);
		const { tokenId, score } = event.returnValues;

		const person = await this.personRepo.findOne({ tokenId });

		const oldScore = person.score || 0;

		try {
			await this.scoreHistoryRepo.create({
				tokenId: tokenId,
				amount: +score - oldScore,
				score: +score,
			});
		} catch (error) {
			console.error('handleEditPerson failed ', error, event.returnValues);
		}
	}
}
