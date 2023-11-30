import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ManagerDocument = Manager & Document;

@Schema({ collection: 'managers', timestamps: true })
export class Manager {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: true })
	walletAddress: string;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);

ManagerSchema.index({ walletAddress: 1 }, { unique: true });
