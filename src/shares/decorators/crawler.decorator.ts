import type { EventData } from 'web3-eth-contract';

import { BaseCrawlerConsole } from '../base/base-crawler.console';

export function UpdateLatestBlock(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
	const originalValue = descriptor.value;

	descriptor.value = async function (...args: any[]): Promise<any> {
		const events = args?.[0] as EventData[];
		const latestBlock = args?.[1] as number;

		if (!events?.length) {
			return (this as BaseCrawlerConsole).updateLatestBlock(latestBlock);
		}

		await originalValue.apply(this as BaseCrawlerConsole, args);

		await (this as BaseCrawlerConsole).updateLatestBlock(latestBlock);
	};
}
