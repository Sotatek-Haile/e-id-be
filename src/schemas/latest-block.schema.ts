import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LatestBlockDocument = LatestBlock & Document;

@Schema({ collection: 'latest_blocks', timestamps: true })
export class LatestBlock {
	@Prop({ type: Number, required: true })
	type: ELatestBlockType;

	@Prop({ type: Number, required: true })
	blockNumber: number;
}

export const LatestBlockSchema = SchemaFactory.createForClass(LatestBlock);

export enum ELatestBlockType {
	MANAGER = 1,
	PERSON,
	ORGANIZATION,
}
