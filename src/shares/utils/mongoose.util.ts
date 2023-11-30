import { Types } from 'mongoose';

export function decimal128ToString(v: Types.Decimal128): string {
	return v.toString();
}
