import { Logger } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';

import { crawlConfig } from '~/config/crawl.config';

import BaseIntervalWorker from '../base/base-interval-worker';
import { implement } from '../decorators/oop.decorator';

// Store in-progress block
let LATEST_PROCESSED_BLOCK = NaN;

export class OrganizationCrawler extends BaseIntervalWorker {
	protected readonly logger = new Logger(this.constructor.name);
	private web3: Web3;
	private readonly latestBlock: number;
	private readonly crawlConfig = crawlConfig;
	private readonly callbackEvent: (events: EventData[], latestBlock: number) => Promise<void>;

	constructor(latestBlock: number, callbackEvent: (blocks: any[], latestBlock: number) => Promise<void>) {
		super();
		this.web3 = new Web3(crawlConfig.provider);
		this.latestBlock = latestBlock;
		this.callbackEvent = callbackEvent;
	}

	@implement
	protected async prepare(): Promise<void> {}

	@implement
	protected async doProcess(): Promise<void> {
		// Firstly try to get latest block number from network
		const latestNetworkBlock = await this.getBlockCount();

		// And looking for the latest processed block in local
		let latestProcessedBlock = LATEST_PROCESSED_BLOCK;

		// If still no data, use the callback in options to get the initial value for this process
		if (!latestProcessedBlock || isNaN(latestProcessedBlock)) {
			latestProcessedBlock = this.latestBlock;
		}

		if (!latestProcessedBlock && this.crawlConfig.contracts.organization.firstCrawlBlock) {
			latestProcessedBlock = this.crawlConfig.contracts.organization.firstCrawlBlock;
		}

		// If there's no data, just process from the newest block on the network
		if (!latestProcessedBlock) {
			latestProcessedBlock = latestNetworkBlock - 1;
		}

		const fromBlockNumber = latestProcessedBlock + 1;

		if (fromBlockNumber >= latestNetworkBlock) {
			console.log(
				`Block <${fromBlockNumber}> is the newest block can be processed (on network: ${latestNetworkBlock}). Wait for the next tick...`,
			);
			return;
		}

		let toBlockNumber = latestProcessedBlock + this.crawlConfig.blockInOneCrawl;

		if (toBlockNumber > latestNetworkBlock) {
			toBlockNumber = latestNetworkBlock;
		}

		await this.processBlocks(fromBlockNumber, toBlockNumber, latestNetworkBlock);
		LATEST_PROCESSED_BLOCK = toBlockNumber;

		if (toBlockNumber >= latestNetworkBlock) {
			console.log(`Have processed newest block already. Will wait for a while until next check...`);
			this.setNextTickTimer(this.crawlConfig.blockTime);
		} else {
			this.setNextTickTimer(500);
		}

		return;
	}

	@implement
	protected async processBlocks(fromBlock: number, toBlock: number, latestNetworkBlock: number): Promise<void> {
		console.log(`Start crawl transactions: ${fromBlock} -> ${toBlock} / ${latestNetworkBlock}`);
		const contractConfig = this.crawlConfig.contracts.organization;

		const contract = new this.web3.eth.Contract(contractConfig.abi, contractConfig.address);
		const events = await contract.getPastEvents('allEvents', {
			fromBlock,
			toBlock,
		});
		this.callbackEvent(events, toBlock);
	}

	@implement
	protected async getBlockCount(): Promise<number> {
		const latestNetworkBlockNumber = await this.web3.eth.getBlockNumber();
		return new BigNumber(latestNetworkBlockNumber.toString()).minus(this.crawlConfig.blockSafeNumber).toNumber();
	}
}
