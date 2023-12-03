import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ collection: 'organizations' })
export class Organization {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: false })
	taxCode: string;

	@Prop({ type: String, required: false })
	ownerAddress: string;

	@Prop({ type: String, required: false })
	tokenId: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

OrganizationSchema.index({ name: 1 });
