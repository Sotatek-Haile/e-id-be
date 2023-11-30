import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import leanGettersPlugin from 'mongoose-lean-getters';

export type PersonDocument = Person & Document;

@Schema({ collection: 'persons', timestamps: true, toJSON: { getters: true } })
export class Person {
	@Prop({ type: Number, required: true, unique: true })
	tokenId: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Number, required: true, default: 0 })
	age?: number;

	@Prop({ type: Number, required: false })
	score: number;

	@Prop({ type: Number, required: true })
	gender: EGenderType;

	@Prop({ type: Date, required: true, default: Date.now })
	dateOfBirth?: Date;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
PersonSchema.plugin(leanGettersPlugin);

PersonSchema.index({ name: 1 });
PersonSchema.index({ tokenId: 1 }, { unique: true });

export enum EGenderType {
	MALE = 1,
	FEMALE,
	OTHER,
}
