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
				},
			},
		]);

		return this.aggregateGetOne(aggregate);
	}
}
