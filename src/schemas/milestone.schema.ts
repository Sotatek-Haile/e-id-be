import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MilestoneDocument = Milestone & Document;

@Schema({ collection: 'milestones', timestamps: true })
export class Milestone {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Number, required: true })
	score: number;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
