import { Person, PersonSchema } from '~/schemas/person.schema';
import { BaseRepository } from '~/shares/base/base.repository';
import { MongoRepository } from '~/shares/decorators/repository.decorator';

@MongoRepository(Person, PersonSchema)
export class PersonRepository extends BaseRepository<Person> {
	getPersonDetail(personAddress: string): Promise<any> {
		const aggregate = this.model.aggregate([
			{ $match: { ownerAddress: personAddress } },
			{
				$lookup: {
					from: 'score-history',
					localField: 'tokenId',
					foreignField: 'tokenId',
					as: 'history',
					pipeline: [
						{
							$lookup: {
								from: 'milestones',
								localField: 'amount',
								foreignField: 'score',
								as: 'name',
							},
						},
						{
							$addFields: {
								name: { $arrayElemAt: ['$name', 0] },
							},
						},
						{
							$addFields: {
								name: '$name.name',
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: 'organizations',
					localField: 'organizationId',
					foreignField: 'tokenId',
					as: 'organization',
				},
			},
			{
				$addFields: {
					organization: { $arrayElemAt: ['$organization', 0] },
				},
			},
		]);

		return this.aggregateGetOne(aggregate);
	}

	getAllPeople(): Promise<any> {
		const aggregate = this.model.aggregate([
			{
				$lookup: {
					from: 'organizations',
					localField: 'organizationId',
					foreignField: 'tokenId',
					as: 'organization',
				},
			},
			{
				$addFields: {
					organization: { $arrayElemAt: ['$organization', 0] },
				},
			},
		]);

		return aggregate.exec();
	}
}
