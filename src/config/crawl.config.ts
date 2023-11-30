import { config } from 'dotenv';

import { managerAbi } from '~/abi/manager';
import { organizationAbi } from '~/abi/organization';
import { personAbi } from '~/abi/person';
import { ICrawlConfig } from '~/shares/interfaces/crawl.interface';

config();

export const crawlConfig: ICrawlConfig = {
	provider: process.env.BSC_RPC,
	blockTime: Number(process.env.BSC_BLOCK_TIME),
	blockSafeNumber: Number(process.env.BSC_BLOCK_SAFE_NUMBER),
	blockInOneCrawl: Number(process.env.BSC_BLOCK_IN_ONE_CRAWL),
	baseCoinDecimals: Number(process.env.BSC_BASE_COIN_DECIMALS),
	contracts: {
		manager: {
			address: process.env.MANAGER_ADDRESS,
			firstCrawlBlock: Number(process.env.REFERRAL_FIRST_CRAWL_BLOCK),
			abi: managerAbi,
		},
		organization: {
			address: process.env.ORGANIZATION_ADDRESS,
			firstCrawlBlock: Number(process.env.STAKE_FIRST_CRAWL_BLOCK),
			abi: organizationAbi,
		},
		person: {
			address: process.env.PERSON_ADDRESS,
			firstCrawlBlock: Number(process.env.BLACKLIST_FIRST_CRAWL_BLOCK),
			abi: personAbi,
		},
	},
};
