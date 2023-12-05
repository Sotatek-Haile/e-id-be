import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
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
		const abi = [
			'string', // UID (cccd)
			'string', // bod
			'string', // user address
			'string', // company id
		];

		const person = {
			name: newPerson.name,
			gender: +newPerson.gender,
			age: +newPerson.age,
			score: +newPerson.score,
			tokenId,
			ownerAddress,
			sensitiveInformation: newPerson.sensitiveInformation,
		};

		if (newPerson.sensitiveInformation) {
			const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(abi, newPerson.sensitiveInformation);
			Object.assign(person, {
				uid: decodedData[0],
				dateOfBirth: decodedData[1],
				address: decodedData[2],
				organizationId: decodedData[3] === '0x' ? null : decodedData[3],
			});
		}

		try {
			await this.personRepo.create(person);
		} catch (error) {
			console.error('handleNewPerson failed ', error, event.returnValues);
		}
	}

	async handleEditPerson(event: EventData): Promise<void> {
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
		const { tokenId, score, sId } = event.returnValues;

		const person = await this.personRepo.findOne({ tokenId });

		const oldScore = person?.score || 0;

		try {
			await this.scoreHistoryRepo.create({
				tokenId: tokenId,
				amount: +score - oldScore,
				score: +score,
				milestoneId: +sId,
			});
			await this.personRepo.updateOne(
				{
					tokenId,
				},
				{
					$set: {
						score: +score,
					},
				},
			);
		} catch (error) {
			console.error('handleEditPerson failed ', error, event.returnValues);
		}
	}
}
