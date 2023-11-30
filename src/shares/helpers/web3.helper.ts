import type { Limit } from 'p-limit';
import Web3 from 'web3';
import type { BlockTransactionString } from 'web3-eth';
import { EventData } from 'web3-eth-contract';

import { crawlConfig } from '~/config/crawl.config';

export async function getBlockInfo(blockNumber: number, web3?: Web3): Promise<BlockTransactionString> {
	if (!web3) {
		web3 = new Web3(crawlConfig.provider);
	}

	const block = await web3.eth.getBlock(blockNumber);
	return block;
}

export async function getBlockTimeByBlockNumbers(
	eventLogs: EventData[],
	pLimit: Limit,
	web3?: Web3,
	acceptedEvent?: string[],
): Promise<{ [x: number]: string | number }> {
	if (!web3) {
		web3 = new Web3(crawlConfig.provider);
	}

	if (acceptedEvent?.length) {
		eventLogs = eventLogs.filter(log => acceptedEvent.includes(log.event));
	}

	const blockNumbers = Array.from(new Set(eventLogs.map(log => log.blockNumber)));
	const blockInfos = await Promise.all(
		blockNumbers.map(async (blockNumber: number) => pLimit(() => getBlockInfo(blockNumber, web3))),
	);
	return blockInfos.reduce((blockTimeByNumber: { [key: number]: number | string }, blockInfo) => {
		return {
			...blockTimeByNumber,
			[blockInfo.number]: blockInfo.timestamp,
		};
	}, {});
}
