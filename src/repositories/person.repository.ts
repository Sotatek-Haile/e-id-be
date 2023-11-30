import { Person, PersonSchema } from '~/schemas/person.schema';
import { BaseRepository } from '~/shares/base/base.repository';
import { MongoRepository } from '~/shares/decorators/repository.decorator';

@MongoRepository(Person, PersonSchema)
export class PersonRepository extends BaseRepository<Person> {}
