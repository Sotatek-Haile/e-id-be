import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import leanGettersPlugin from 'mongoose-lean-getters';

export type ScoreHistoryDocument = ScoreHistory & Document;

@Schema({ collection: 'score-history', timestamps: true, toJSON: { getters: true } })
export class ScoreHistory {
	@Prop({ type: String, required: true, unique: true })
	tokenId: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Number, required: true })
	amount: number;
}

export const ScoreHistorySchema = SchemaFactory.createForClass(ScoreHistory);
ScoreHistorySchema.plugin(leanGettersPlugin);

ScoreHistorySchema.index({ name: 1 });
ScoreHistorySchema.index({ tokenId: 1 });
