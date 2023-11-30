export interface IContract {
	address: string;
	firstCrawlBlock: number;
	abi: any;
}

export interface ICrawlConfig {
	provider: string;
	blockTime: number;
	blockSafeNumber: number;
	blockInOneCrawl: number;
	baseCoinDecimals: number;
	contracts: Record<string, IContract>;
}
