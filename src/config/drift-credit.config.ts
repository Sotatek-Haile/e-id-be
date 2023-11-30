import { config } from 'dotenv';

config();

export const driftCredit = {
	address: process.env.DRIFT_CREDIT_ADDRESS,
	decimals: Number(process.env.DRIFT_CREDIT_DECIMALS) ?? 18,
};
